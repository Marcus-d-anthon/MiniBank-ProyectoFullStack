import mongoose from "mongoose";

export const conectarBD = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('😎 Conexión a MongoDB con éxito 😎')
    } catch(error){
        console.log('😵 Error al establecer conexión con MongoDB', error.message)
    }
}

mongoose.connection.once('open', () => {
  console.log('📦 Base de datos conectada:', mongoose.connection.name);
});