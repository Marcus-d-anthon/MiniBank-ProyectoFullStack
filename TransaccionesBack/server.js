import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { conectarBD } from './src/config/database.js';
import { globalErrorHandler, star_logger } from './src/middlewares/middlewares.js';
import { AppError } from './src/utils/AppError.js';
import userRoutes from './src/routes/UserRoutes.js';
import accountRoutes from './src/routes/AccountRoutes.js';
import transactionRoutes from './src/routes/TransactionRoutes.js';

dotenv.config();

const API_VERSION = process.env.API_VERSION;
const PORT = process.env.PORT;

const app = express();

// CONEXIÓN BD
conectarBD();

// CORS
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(star_logger);

// RUTA DE INICIO
app.get('/', (req, res) => {
    res
        .status(200)
        .type('text/plain')
        .send(`Helou desde el Servidor Express en el puerto ${PORT}`);
});

// MONTAJE DE RUTAS
app.use(`/api/v${API_VERSION}`, userRoutes);
app.use(`/api/v${API_VERSION}/accounts`, accountRoutes);
app.use(`/api/v${API_VERSION}/transactions`, transactionRoutes);

// RUTA NO ENCONTRADA
app.use((req, res, next) => {
    next(
        new AppError(
            `No se encontró la ruta ${req.originalUrl} en este servidor`,
            404
        )
    );
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(
        `Servidor escuchando a través del puerto ${PORT} con la versión ${API_VERSION}`
    );
});
