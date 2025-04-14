import { Schema, model, Document, Types } from 'mongoose';

export interface ICuenta extends Document {
  numeroCuenta: string;
  tipo: "debito" | "credito";
  saldo: number;
  clienteId: Types.ObjectId;
}

const cuentaSchema = new Schema<ICuenta>({
  numeroCuenta: { type: String, required: true, unique: true },
  tipo: { type: String, required: true, enum: ["debito", "credito"] },
  saldo: { type: Number, required: true },
  clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true }
});

export default model<ICuenta>('Cuenta', cuentaSchema);