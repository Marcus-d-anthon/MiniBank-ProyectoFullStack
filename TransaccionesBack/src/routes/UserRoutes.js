import express from 'express';
import {mostrarUsuario, crearUsuario, mostrarUsuarioXEmail, actualizarUsuario, eliminarUsuario, getMe } from '../controllers/ControladorUsuario.js';
import { login } from '../controllers/AuthController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * ==========================
 * RUTAS DE USUARIO
 * ==========================
 * El usuario usará la siguiente ruta para registrar sus datos:
 * POST /api/v{version}/usuarios
 * 
 * Para logearse con los datos que ingreso será:
 * POST /api/v{version}/auth/login
 * 
 * Accede a su información a través de:
 * GET /api/v{version}/usuarios/:email
 * 
 * Actualiza su información:
 * PUT /api/v{version}/usuarios/:email
 */

/**
 * CREATE -> POST
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/usuarios
 */
router.post('/usuarios', crearUsuario);

/**
 * READ -> GET/:email (Solo un usuario)
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/usuarios/{correo}
 */
router.get(
    '/usuarios/:email',
    protect,
    mostrarUsuarioXEmail
);

/**
 * UPDATE -> PUT
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/usuarios/{correo}
 */
router.put(
    '/usuarios/:id',
    protect,
    actualizarUsuario
);

/**
 * DELETE -> DEL (lógico)
 * ENDPOINT
 * http://localhost/api/v{versionamiento_actual}/usuarios/{correo}
 */
router.delete(
    '/usuarios/:email',
    protect,
    restrictTo('admin'),
    eliminarUsuario
);

/**
 * ==========================
 * RUTAS DE ADMIN
 * ==========================
 * El admin puede visualizar todos los usuarios en la BD:
 * GET /api/v{version}/usuarios
 */
router.get(
    '/usuarios',
    protect,
    restrictTo('admin'),
    mostrarUsuario
);

/**
 * ==========================
 * AUTH
 * ==========================
 */

/**
 * LOGIN
 * POST /api/v{version}/auth/login
 */
router.post('/auth/login', login);

/**
 * DATOS DEL USUARIO LOGEADO (REACT)
 * GET /api/v{version}/auth/me
 */
router.get('/auth/me', protect, getMe);

export default router;
