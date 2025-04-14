// src/__tests__/cliente.model.test.ts
import Cliente from '../models/cliente';

describe('Modelo Cliente', () => {
  it('debería crear un cliente válido', () => {
    const cliente = new Cliente({
      nombre: 'Juan Pérez',
      documento: '00123456789',
      email: 'juan@mail.com',
      telefono: '8091234567'
    });

    expect(cliente.nombre).toBe('Juan Pérez');
    expect(cliente.documento).toBe('00123456789');
    expect(cliente.email).toBe('juan@mail.com');
    expect(cliente.telefono).toBe('8091234567');
  });
});
