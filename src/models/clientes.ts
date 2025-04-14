import { Schema, model, Document } from 'mongoose';

export interface ICliente extends Document {
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
}

const clienteSchema = new Schema<ICliente>({
  nombre: { type: String, required: true },
  documento: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true }
});

export default model<ICliente>('Cliente', clienteSchema);