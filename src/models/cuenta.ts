import { Schema, model, Document, Types } from 'mongoose';

export interface ICuenta extends Document {
  numeroCuenta: string;
  tipo: 'Ahorro'|'Corriente';
  saldo: number;
}

const cuentaSchema = new Schema<ICuenta>({
  numeroCuenta: { type: String, required: true, unique: true },
  tipo: { type: String, enum: ['Ahorro', 'Corriente'], required: true },
  saldo: { type: Number, required: true, default: 0 },
});

const cuentaModel = model<ICuenta>('Cuenta', cuentaSchema)
export default cuentaModel;
