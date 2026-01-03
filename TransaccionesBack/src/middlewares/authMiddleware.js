import jwt from 'jsonwebtoken'
import UsersSchema from '../models/User.js'
import { AppError } from '../utils/AppError.js'
import { catchAsync } from '../utils/catchAsync.js'

export const protect = catchAsync(async(req, res, next) => {
    let token
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token){
        return next( new AppError('No estás autenticado. Porfavor Inicia Sesión', 401))
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await UsersSchema.findById(decoded.id)

    if (!currentUser) {
        return next( new AppError ('El usuario no existe', 401))
    }

    if (currentUser.estado !== 'activo'){
        return next (new AppError('Usuario inactivo o suspendido', 403))
    }

    req.user = currentUser;
    next();
})

export const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)){
            return next (new AppError('No tienes permisos para esta acción', 403))
        }
        next();
    }
}

/* export const restrictToOwnerOrAdmin = (req, res, next) => {
    if ( req.user.rol === 'admin' || req.user.email === req.params.email){
        return next();
    }

    return next(new AppError('No tienes permiso para esta acción', 403))
} */