import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    cuenta_origen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },

    cuenta_destino: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },

    tipo: {
      type: String,
      enum: ["transferencia"],
      default: "transferencia",
      required: true
    },

    monto: {
      type: Number,
      required: true,
      min: 20
    },

    estado: {
      type: String,
      enum: ["pendiente", "completada", "fallida"],
      default: "pendiente"
    },

    descripcion: {
      type: String,
      default: "Sin Descripción"
    }
  },
  {
    timestamps: {
      createdAt: "fecha_creacion",
      updatedAt: false
    }
  }
);

export const Transaction = mongoose.model("Transaction", TransactionSchema);
