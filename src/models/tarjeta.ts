import { Schema, model, Document, Types } from 'mongoose';

export interface ITarjeta extends Document {
  numeroTarjeta: string;
  pin: string;
  estado: string;
  fechaExpiracion: Date;
  cuentaId: Types.ObjectId;
}

const tarjetaSchema = new Schema<ITarjeta>({
  numeroTarjeta: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  estado: { type: String, required: true },
  fechaExpiracion: { type: Date, required: true },
  cuentaId: { type: Schema.Types.ObjectId, ref: 'Cuenta', required: true }
});

export default model<ITarjeta>('Tarjeta', tarjetaSchema);
