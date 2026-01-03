import UsersSchema from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { catchAsync } from '../utils/catchAsync.js'

/**
 * GET /usuarios (ADMIN)
 */
export const mostrarUsuario = catchAsync(async (req, res, next) => {
    const usuarios = await UsersSchema
        .find({ estado: 'activo' })
        .select('-password');

    res.status(200).json({
        status: 'success',
        message: 'Usuarios obtenidos correctamente',
        results: usuarios.length,
        usuarios
    });
});

/**
 * POST /usuarios
 */
export const crearUsuario = catchAsync(async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return next(
            new AppError('Debe enviar los datos del usuario', 400)
        );
    }

    const { nombre, email, password, telefono, rol } = req.body;

    if (!email || !password || !telefono) {
        return next(
            new AppError('Email, Password y Teléfono son obligatorios', 400)
        );
    }

    if (!nombre?.primer_nombre || !nombre?.primer_apellido) {
        return next(
            new AppError('Nombre y Apellido son obligatorios', 400)
        );
    }

    const existeUsuario = await UsersSchema.findOne({ email });
    if (existeUsuario) {
        return next(
            new AppError('El Email ya se encuentra registrado', 400)
        );
    }

    await UsersSchema.create({
        nombre: {
            primer_nombre: nombre.primer_nombre,
            segundo_nombre: nombre.segundo_nombre || '',
            primer_apellido: nombre.primer_apellido,
            segundo_apellido: nombre.segundo_apellido || ''
        },
        email,
        password,
        telefono,
        rol
    });

    res.status(201).json({
        status: 'success',
        message: 'Usuario creado correctamente'
    });
});

/**
 * GET /usuarios/:email
 */
export const mostrarUsuarioXEmail = catchAsync(async (req, res, next) => {
    const { email } = req.params;

    const usuario = await UsersSchema
        .findOne({ email })
        .select('-password');

    if (!usuario) {
        return next(
            new AppError('El Usuario no fue encontrado en la BD', 404)
        );
    }

    res.status(200).json({
        status: 'success',
        message: 'Usuario encontrado',
        usuario
    });
});


/**
 * PUT /usuarios/:id
 */
export const actualizarUsuario = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Capturamos el ID de la URL
    const { nombre, telefono, password } = req.body;

    if (!req.body || Object.keys(req.body).length === 0) {
        return next(new AppError('Debe enviar al menos un dato para actualizar', 400));
    }

    // 1. Buscar por ID (importante para que no dé 404)
    const usuario = await UsersSchema.findById(id);

    if (!usuario) {
        return next(new AppError('El Usuario no fue encontrado en la BD', 404));
    }

    // 2. Actualizar nombres y teléfono
    if (nombre) usuario.nombre = nombre;
    if (telefono) usuario.telefono = telefono;

    // 3. Lógica de Contraseña: Si el usuario escribió algo, se asigna.
    // El middleware .pre('save') de tu modelo User.js se encargará de encriptarla.
    if (password && password.trim() !== '') {
        usuario.password = password;
    }

    // 4. Guardar (activa validaciones y hooks de bcrypt)
    await usuario.save();

    // Ocultar password de la respuesta
    usuario.password = undefined;

    res.status(200).json({
        status: 'success',
        message: 'Usuario actualizado correctamente',
        usuario
    });
});


/**
 * DELETE /usuarios/:email
 */
export const eliminarUsuario = catchAsync(async (req, res, next) => {
    const { email } = req.params;

    const usuarioDel = await UsersSchema.findOne({ email });

    if (!usuarioDel) {
        return next(
            new AppError('El Usuario no fue encontrado en la BD', 404)
        );
    }

    if (usuarioDel.estado === 'inactivo') {
        return next(
            new AppError('El usuario ya se encuentra inactivo', 400)
        );
    }

    usuarioDel.estado = 'inactivo';
    await usuarioDel.save();

    res.status(200).json({
        status: 'success',
        message: 'Usuario eliminado correctamente',
        usuarioDel
    });
});

export const getMe = (req, res) => {
    res.status(200).json({
        status: 'success',
        user: req.user
    });
};
