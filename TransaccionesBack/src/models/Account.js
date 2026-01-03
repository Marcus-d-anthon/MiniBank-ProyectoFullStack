import mongoose from "mongoose";

const AccountSchema = mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        numero_cuenta:{
            type: String,
            required: true,
            unique: true
        },
        saldo_actual:{
            type: Number,
            default: 0,
            required: true,
            min: 10
        },
        moneda:{
            type: String,
            default: "USD",
            enum: ["USD", "EUR", "MXN"],
            required: true
        },
        estado:{
            type: String,
            enum: ["activo", "inactivo", "suspendido"],
            required: true,
            default: "activo",
        }
    },
    {
        timestamps: {
            createdAt: 'fecha_creacion',
            updatedAt: 'fecha_actualizacion'
        }
    }
)

export const Account = mongoose.model("Account", AccountSchema)