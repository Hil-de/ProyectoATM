// src/__tests__/atm.service.test.ts
import { ATMService } from '../services/atm.service';
import Tarjeta from '../models/tarjeta';
import Cuenta from '../models/cuenta';
import Transaccion from '../models/transaccion';

// Mocks para las bases de datos
jest.mock('../models/tarjeta');
jest.mock('../models/cuenta');
jest.mock('../models/transaccion');

describe('ATMService', () => {
  let atmService: ATMService;

  beforeEach(() => {
    atmService = new ATMService();

    // Resetear mocks antes de cada test
    Tarjeta.findOne = jest.fn();
    Cuenta.findById = jest.fn();
  });

  it('debería verificar el PIN correctamente', async () => {
    const mockTarjeta = { pin: '1234', estado: 'activo', _id: '12345' };
    // Mock de la función findOne para devolver el mock de la tarjeta
    (Tarjeta.findOne as jest.Mock).mockResolvedValue(mockTarjeta);

    const result = await atmService.verificarPin('12345', '1234');
    expect(result).toBe(true);
  });

  it('debería fallar si el PIN es incorrecto', async () => {
    const mockTarjeta = { pin: '1234', estado: 'activo', _id: '12345' };
    (Tarjeta.findOne as jest.Mock).mockResolvedValue(mockTarjeta);

    const result = await atmService.verificarPin('12345', '0000');
    expect(result).toBe(false);
  });

  it('debería consultar saldo correctamente', async () => {
    const mockTarjeta = { pin: '1234', estado: 'activo', cuentaId: '67890' };
    const mockCuenta = { saldo: 5000 };

    // Mock de findOne para tarjeta y findById para la cuenta
    (Tarjeta.findOne as jest.Mock).mockResolvedValue(mockTarjeta);
    (Cuenta.findById as jest.Mock).mockResolvedValue(mockCuenta);

    const saldo = await atmService.consultarSaldo('12345', '1234');
    expect(saldo).toBe(5000);
  });

  it('debería realizar un depósito con éxito', async () => {
    const mockTarjeta = { pin: '1234', estado: 'activo', cuentaId: '67890' };
    const mockCuenta = { saldo: 1000, save: jest.fn() };

    // Mock de findOne para tarjeta y findById para la cuenta
    (Tarjeta.findOne as jest.Mock).mockResolvedValue(mockTarjeta);
    (Cuenta.findById as jest.Mock).mockResolvedValue(mockCuenta);

    const result = await atmService.hacerDeposito('12345', '1234', 500);
    expect(result).toBe('Depósito realizado con éxito');
    expect(mockCuenta.save).toHaveBeenCalled();
  });

  it('debería fallar si no hay fondos suficientes al retirar', async () => {
    const mockTarjeta = { pin: '1234', estado: 'activo', cuentaId: '67890' };
    const mockCuenta = { saldo: 500 };

    (Tarjeta.findOne as jest.Mock).mockResolvedValue(mockTarjeta);
    (Cuenta.findById as jest.Mock).mockResolvedValue(mockCuenta);

    await expect(atmService.retirarEfectivo('12345', '1234', 600))
      .rejects
      .toThrowError('Fondos insuficientes');
  });
});
