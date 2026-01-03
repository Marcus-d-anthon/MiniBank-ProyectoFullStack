// Indicar de solicitudes posteriores en el Servidor
export const star_logger = (req, res, next) => {
    const fecha = new Date().toLocaleString();
    console.log(`{${fecha}} ✅ Solicitud ${req.method} en ${req.originalUrl}`);
    next()
}

// Manejador de errores centralizado -> Más óptimo
export const globalErrorHandler = (err, req, res, next) => {
    const fecha = new Date().toLocaleString();
    const statusCode = err.statusCode || 500;

    console.error(`{${fecha}} ❌ Motívo del Error ❌ ->  ${err.message}`)

    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Error inesperado en el servidor'
    })
}