import { Schema, model, Document, Types } from 'mongoose';

export interface ICierreDiario extends Document {
  fecha: Date;
  atmId: Types.ObjectId;
  totalRetirado: number;
  totalDepositado: number;
  efectivoEnCaja: number;
}

const cierreDiarioSchema = new Schema<ICierreDiario>({
  fecha: { type: Date, default: Date.now },
  atmId: { type: Schema.Types.ObjectId, ref: 'ATM', required: true },
  totalRetirado: { type: Number, required: true },
  totalDepositado: { type: Number, required: true },
  efectivoEnCaja: { type: Number, required: true }
});

export default model<ICierreDiario>('CierreDiario', cierreDiarioSchema);
