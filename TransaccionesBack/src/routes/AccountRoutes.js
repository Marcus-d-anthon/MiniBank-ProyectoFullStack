import express from 'express';
import {
    mostrarAccounts,
    mostrarAccountById,
    crearAccount,
    actualizarAccount,
    eliminarAccount,
    transferirDinero
} from '../controllers/ControladorAccount.js';

import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * ==========================
 * RUTAS DE CUENTAS
 * ==========================
 */

router.get(
    '/my-accounts',
    protect,
    mostrarAccounts
);

/**
 * READ -> GET (Todas las cuentas)
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/accounts
 */
router.get(
    '/',
    protect,
    restrictTo('admin'),
    mostrarAccounts
);

/**
 * READ -> GET/:id
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/accounts/{id}
 */
router.get(
    '/:id',
    protect,
    mostrarAccountById
);

/**
 * CREATE -> POST
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/accounts
 */
router.post(
    '/',
    protect,
    crearAccount
);

/**
 * UPDATE -> PUT
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/accounts/{id}
 */
router.put(
    '/:id',
    protect,
    actualizarAccount
);

/**
 * DELETE -> DEL (lógico)
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/accounts/{id}
 */
router.delete(
    '/:id',
    protect,
    restrictTo('admin'),
    eliminarAccount
);

router.post(
    '/transfer',
    protect,
    transferirDinero
);

export default router;