import { Schema, model, Document, Types } from 'mongoose';

export interface ITarjeta extends Document {
  numeroTarjeta: string;
  pin: string;
  estado: 'Activa' | 'Bloqueada';
  fechaExpiracion: Date;
  cuentaId: Types.ObjectId;
}

const tarjetaSchema = new Schema<ITarjeta>({
  numeroTarjeta: { type: String, required: true, unique: true },
  pin: { type: String, required: true },
  estado: { type: String, enum: ['Activa','Bloqueda'], required: true },
  fechaExpiracion: { type: Date, required: true },
  cuentaId: { type: Schema.Types.ObjectId, ref: 'Cuenta', required: true }
});


const TarjetaModel = model<ITarjeta>('Tarjeta', tarjetaSchema)
export default TarjetaModel
