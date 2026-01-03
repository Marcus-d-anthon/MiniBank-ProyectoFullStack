import { Account } from '../models/Account.js'
import { Transaction } from '../models/Transaction.js';
import { AppError } from '../utils/AppError.js'
import { catchAsync } from '../utils/catchAsync.js'

/**
 * GET /accounts
 */
export const mostrarAccounts = catchAsync(async (req, res, next) => {
    let filtro = { estado: 'activo' };
    if (req.user.rol !== 'admin') {
        filtro.user_id = req.user._id;
    }

    const accounts = await Account.find(filtro)
        .populate('user_id', 'email nombre');

    res.status(200).json({
        status: 'success',
        results: accounts.length,
        accounts
    });
});

/**
 * GET /accounts/:id
 */
export const mostrarAccountById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const account = await Account.findById(id)
        .populate('user_id', 'email nombre');

    if (!account) {
        return next(
            new AppError('Cuenta no encontrada', 404)
        );
    }

    res.status(200).json({
        status: 'success',
        account
    });
});


/**
 * POST /accounts
 * Modificado para autogenerar numero_cuenta y saldo_actual: 10
 */
export const crearAccount = catchAsync(async (req, res, next) => {
    let ownerUserId;

    if (req.user.rol === 'admin') {
        ownerUserId = req.body.user_id || req.user._id;
    } else {
        ownerUserId = req.user._id;
    }
    const ultimaCuenta = await Account.findOne().sort({ numero_cuenta: -1 });
    
    let siguienteNumero = 1;
    if (ultimaCuenta && ultimaCuenta.numero_cuenta) {
        const partes = ultimaCuenta.numero_cuenta.split('-');
        if (partes.length === 2) {
            siguienteNumero = parseInt(partes[1], 10) + 1;
        }
    }
    const nuevoNumeroCuenta = `ABC-${String(siguienteNumero).padStart(6, '0')}`;
    const account = await Account.create({
        user_id: ownerUserId,
        numero_cuenta: nuevoNumeroCuenta,
        saldo_actual: 10,
        moneda: req.body.moneda || 'USD',
        estado: 'activo'
    });

    res.status(201).json({
        status: 'success',
        message: 'Cuenta creada correctamente',
        account
    });
});


/**
 * PUT /accounts/:id
 */
export const actualizarAccount = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const accountUpd = await Account.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!accountUpd) {
        return next(
            new AppError('Cuenta no encontrada', 404)
        );
    }

    res.status(200).json({
        status: 'success',
        message: 'Cuenta actualizada correctamente',
        account: accountUpd
    });
});

/**
 * DELETE /accounts/:id (lógica)
 */
export const eliminarAccount = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const account = await Account.findById(id);

    if (!account) {
        return next(
            new AppError('Cuenta no encontrada', 404)
        );
    }

    if (account.estado === 'inactivo') {
        return next(
            new AppError('La cuenta ya se encuentra inactiva', 400)
        );
    }

    account.estado = 'inactivo';
    await account.save();

    res.status(200).json({
        status: 'success',
        message: 'Cuenta desactivada correctamente',
        account
    });
});

export const transferirDinero = catchAsync(async (req, res, next) => {
    const { numero_cuenta_destino, monto, concepto } = req.body;
    const userIdEmisor = req.user._id || req.user.id;
    const montoNum = Number(monto);

    // 1. Buscar cuentas
    const cuentaOrigen = await Account.findOne({ user_id: userIdEmisor });
    const cuentaDestino = await Account.findOne({ numero_cuenta: numero_cuenta_destino });

    if (!cuentaOrigen) return next(new AppError('No tienes cuenta origen', 404));
    if (!cuentaDestino) return next(new AppError('La cuenta destino no existe', 404));
    
    // IMPORTANTE: Cambiamos .saldo por .saldo_actual según tu imagen
    if (cuentaOrigen.saldo_actual < montoNum) {
        return next(new AppError('Saldo insuficiente', 400));
    }

    // 2. ACTUALIZACIÓN USANDO EL NOMBRE DE CAMPO REAL: saldo_actual
    await Account.updateOne(
        { _id: cuentaOrigen._id },
        { $inc: { saldo_actual: -montoNum } } // Restamos
    );

    await Account.updateOne(
        { _id: cuentaDestino._id },
        { $inc: { saldo_actual: montoNum } } // Sumamos
    );

    // 3. REGISTRO DE TRANSACCIÓN
    await Transaction.create({
        user_id: userIdEmisor,
        cuenta_origen: cuentaOrigen._id,
        cuenta_destino: cuentaDestino._id,
        monto: montoNum,
        concepto: concepto || 'Transferencia Bancaria',
        fecha_creacion: new Date()
    });

    res.status(200).json({
        status: 'success',
        message: 'Transferencia realizada con éxito'
    });
});