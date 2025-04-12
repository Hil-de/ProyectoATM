import { Schema, model, Document, Types } from 'mongoose';

export interface ICuenta extends Document {
  numeroCuenta: string;
  tipo: string;
  saldo: number;
  clienteId: Types.ObjectId;
}

const cuentaSchema = new Schema<ICuenta>({
  numeroCuenta: { type: String, required: true, unique: true },
  tipo: { type: String, required: true },
  saldo: { type: Number, required: true },
  clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true }
});

export default model<ICuenta>('Cuenta', cuentaSchema);
