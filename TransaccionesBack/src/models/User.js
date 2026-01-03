import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UsersSchema = new mongoose.Schema(
    {
        nombre: { 
            primer_nombre: { type: String, required: true},
            segundo_nombre: { type: String, default: ""},
            primer_apellido: { type: String, required: true},
            segundo_apellido: { type: String, default: ""}
         },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minLength: 8,
            select: false
        },
        telefono: {
            type: String,
            required: true
        },
        rol:{
            type: String,
            enum: ["user", "admin"],
            required: true,
            default: "user"
        },
        estado: {
            type: String,
            enum: ["activo", "inactivo", "suspendido"],
            default: "activo"
        },
        passwordChangedAt: Date
    },
    {
        timestamps: {
            createdAt: 'fecha_creacion',
            updatedAt: 'fecha_actualizado'
        }
    }
);

UsersSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangeAt = Date.now() - 100;
})

UsersSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

export default mongoose.model('User', UsersSchema);