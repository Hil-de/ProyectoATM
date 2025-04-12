import { Schema, model, Document } from 'mongoose';

export interface IATM extends Document {
  ubicacion: string;
  efectivoDisponible: number;
  estado: string;
}

const atmSchema = new Schema<IATM>({
  ubicacion: { type: String, required: true },
  efectivoDisponible: { type: Number, required: true },
  estado: { type: String, required: true }
});

export default model<IATM>('ATM', atmSchema);
