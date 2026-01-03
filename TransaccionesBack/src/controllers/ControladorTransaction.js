import { Transaction } from '../models/Transaction.js';
import { Account } from '../models/Account.js';
import { AppError } from '../utils/AppError.js';
import { catchAsync } from '../utils/catchAsync.js';

/**
 * GET /transactions (ADMIN / USER filtrado)
 */
export const mostrarTransactions = catchAsync(async (req, res, next) => {
    let filtro = {};

    if (req.user.rol !== 'admin') {
        // 1. Buscamos primero cuáles son las cuentas del usuario logueado
        const misCuentas = await Account.find({ user_id: req.user._id });
        const idsMisCuentas = misCuentas.map(acc => acc._id);

        // 2. Filtramos transacciones donde cualquiera de sus cuentas sea origen O destino
        filtro = {
            $or: [
                { cuenta_origen: { $in: idsMisCuentas } },
                { cuenta_destino: { $in: idsMisCuentas } }
            ]
        };
    }

    const transactions = await Transaction.find(filtro)
        .populate('user_id', 'email nombre')
        .populate('cuenta_origen', 'numero_cuenta user_id') // Agregamos user_id al populate
        .populate('cuenta_destino', 'numero_cuenta user_id') // Agregamos user_id al populate
        .sort('-fecha_creacion'); // Ordenamos por la más reciente

    res.status(200).json({
        status: 'success',
        results: transactions.length,
        transactions
    });
});

/**
 * GET /transactions/:id
 */
export const mostrarTransactionById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
        .populate('user_id', 'email nombre')
        .populate('cuenta_origen', 'numero_cuenta')
        .populate('cuenta_destino', 'numero_cuenta');

    if (!transaction) {
        return next(
            new AppError('Transacción no encontrada', 404)
        );
    }

    res.status(200).json({
        status: 'success',
        transaction
    });
});

/**
 * POST /transactions
 * SOLO TRANSFERENCIA
 */
export const crearTransaction = catchAsync(async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return next(
            new AppError('Debe enviar los datos de la transferencia', 400)
        );
    }

    const { cuenta_origen, cuenta_destino, monto, descripcion } = req.body;

    if (!cuenta_origen || !cuenta_destino || !monto) {
        return next(
            new AppError('Cuenta origen, cuenta destino y monto son obligatorios', 400)
        );
    }

    if (cuenta_origen === cuenta_destino) {
        return next(
            new AppError('La cuenta origen y destino no pueden ser la misma', 400)
        );
    }

    const user_id = req.user._id;
    const esAdmin = req.user.rol === 'admin';

    const cuentaOrigen = await Account.findOne({
        numero_cuenta: cuenta_origen,
        estado: 'activo'
    });

    const cuentaDestino = await Account.findOne({
        numero_cuenta: cuenta_destino,
        estado: 'activo'
    });

    if (!cuentaOrigen || !cuentaDestino) {
        return next(
            new AppError('Una o ambas cuentas no existen o están inactivas', 404)
        );
    }

    if (!esAdmin && cuentaOrigen.user_id.toString() !== user_id.toString()) {
        return next(
            new AppError('No tienes permiso para operar esta cuenta', 403)
        );
    }

    const SALDO_MINIMO = 10;
    const montoDisponible = cuentaOrigen.saldo_actual - SALDO_MINIMO;

    if (montoDisponible <= 0) {
        return next(
            new AppError(
                'No puedes transferir, debes mantener al menos $10 en tu cuenta',
                400
            )
        );
    }

    const montoFinal = monto > montoDisponible ? montoDisponible : monto;

    cuentaOrigen.saldo_actual -= montoFinal;
    cuentaDestino.saldo_actual += montoFinal;

    await cuentaOrigen.save();
    await cuentaDestino.save();

    const transaction = await Transaction.create({
        user_id,
        cuenta_origen: cuentaOrigen._id,
        cuenta_destino: cuentaDestino._id,
        tipo: 'transferencia',
        monto: montoFinal,
        estado: 'completada',
        descripcion
    });

    res.status(201).json({
        status: 'success',
        message: 'Transferencia realizada correctamente',
        transaction
    });
});
