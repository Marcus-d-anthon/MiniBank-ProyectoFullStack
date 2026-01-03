import jwt from 'jsonwebtoken';
import UsersSchema from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { catchAsync } from '../utils/catchAsync.js'


const signToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    )
}

const createSendToken = (user, codigoEstado, res) => {
    const token = signToken(user._id);
    user.password = undefined;

    res.status(codigoEstado).json({
        status: 'success',
        token,
        usuario: {
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        }
    });
};

export const login = catchAsync( async (req, res, next) => {
    if (!req.body) {
        return next(new AppError('No se enviaron datos en el body', 400))
    }
    
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('El Email y Contraseña son obligatorios', 400))
    }

    const user = await UsersSchema
    .findOne({ email, estado: 'activo' })
    .select('+password')

    if (!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError ('Credenciales Incorrectas', 401))
    }

    createSendToken(user, 200, res)
})