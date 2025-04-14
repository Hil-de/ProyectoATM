// src/tests/cuenta.model.test.ts
import mongoose from 'mongoose';
import Cuenta from '../models/cuenta';

describe('Modelo Cuenta', () => {
  it('debería crear una cuenta válida', () => {
    const clienteId = new mongoose.Types.ObjectId();

    const cuenta = new Cuenta({
      numeroCuenta: '1234567890',
      tipo: 'debito',
      saldo: 1000,
      clienteId: clienteId
    });

    expect(cuenta.numeroCuenta).toBe('1234567890');
    expect(cuenta.tipo).toBe('debito');
    expect(cuenta.saldo).toBe(1000);
    expect(cuenta.clienteId.toString()).toBe(clienteId.toString());
  });
});
