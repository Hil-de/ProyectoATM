import { Schema, model, Document, Types } from 'mongoose';

export interface ITransaccion extends Document {
  tipo: 'Retiro' | 'Deposito';
  monto: number;
  fecha: Date;
  resultado: 'Exitoso'|'Fallido';
  tarjetaId: Types.ObjectId;
}

const transaccionSchema = new Schema<ITransaccion>({
  tipo: { type: String, required: true },
  monto: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  resultado: { type: String, enum:['Retiro','Deposito'], required: true },
  tarjetaId: { type: Schema.Types.ObjectId, ref: 'Tarjeta', required: true },
});

const TransaccionModel = model<ITransaccion>('Transaccion', transaccionSchema)
export default TransaccionModel
