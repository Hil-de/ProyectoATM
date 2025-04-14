import { Schema, model, Document, Types } from 'mongoose';

export interface ITransaccion extends Document {
  tipo: string;
  monto: number;
  fecha: Date;
  resultado: "exitoso" | "fallido";
  tarjetaId: Types.ObjectId;
}

const transaccionSchema = new Schema<ITransaccion>({
  tipo: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  resultado: { type: String, required: true, enum: ["exitoso", "fallido"] },
  tarjetaId: { type: Schema.Types.ObjectId, ref: 'Tarjeta', required: true },
});

export default model<ITransaccion>('Transaccion', transaccionSchema);
