import mongoose from 'mongoose';
import Tarjeta from '../models/tarjeta';

describe('Modelo Tarjeta', () => {
  it('debería crear una tarjeta válida', () => {
    const cuentaId = new mongoose.Types.ObjectId();

    const tarjeta = new Tarjeta({
      numeroTarjeta: '4111111111111111',
      pin: '1234',
      estado: 'activo',
      fechaExpiracion: new Date('2026-12-31'),
      cuentaId: cuentaId
    });

    expect(tarjeta.numeroTarjeta).toBe('4111111111111111');
    expect(tarjeta.pin).toBe('1234');
    expect(tarjeta.estado).toBe('activo');
    expect(tarjeta.fechaExpiracion).toBeInstanceOf(Date);
    expect(tarjeta.cuentaId.toString()).toBe(cuentaId.toString());
  });
});
