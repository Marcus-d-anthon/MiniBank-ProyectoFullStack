import express from 'express';
import {
    mostrarTransactions,
    mostrarTransactionById,
    crearTransaction
} from '../controllers/ControladorTransaction.js';

import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// NUEVA RUTA: Para que el USER pueda acceder sin el 403 de la ruta '/'
router.get(
    '/my-transactions',
    protect,
    mostrarTransactions
);

/**
 * ADMIN → ver todas las transacciones
 */
router.get(
    '/',
    protect,
    restrictTo('admin'),
    mostrarTransactions
);

/**
 * USER / ADMIN → crear transferencia
 */
router.post(
    '/',
    protect,
    crearTransaction
);

/**
 * USER / ADMIN → ver una transacción
 */
router.get(
    '/:id',
    protect,
    mostrarTransactionById
);

export default router;