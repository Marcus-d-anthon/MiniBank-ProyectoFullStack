export class AppError extends Error{
    constructor(message, codigoEstado){
        super(message);

        this.statusCode = codigoEstado;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor)
    }
}