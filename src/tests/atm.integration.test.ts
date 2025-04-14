// src/tests/atm.integration.test.ts
import mongoose from 'mongoose';
import connectDB from '../config/db';
import Tarjeta from '../models/tarjeta';
import Cuenta from '../models/cuenta';
import { ATMService } from '../services/atm.service';
import logger from '../config/logger';

describe('Pruebas integrales de ATMService', () => {
  let atmService: ATMService;

  beforeAll(async () => {
    await connectDB();
    atmService = new ATMService();
    logger.info('Conexión a la base de datos establecida');
  });

  afterAll(async () => {
    await mongoose.connection.close();
    logger.info('Conexión a la base de datos cerrada');
  });

  it('debería verificar correctamente el PIN desde la base de datos', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    expect(tarjeta).not.toBeNull();

    const result = await atmService.verificarPin(tarjeta!.numeroTarjeta, '5678');
    expect(result).toBe(true);
  });

  it('debería consultar el saldo real de la cuenta asociada a la tarjeta', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    const cuenta = await Cuenta.findById(tarjeta?.cuentaId);

    const saldo = await atmService.consultarSaldo(tarjeta!.numeroTarjeta, '5678');
    expect(saldo).toBe(cuenta?.saldo);
  });

  it('debería lanzar error si el PIN es incorrecto', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });

    await expect(
      atmService.consultarSaldo(tarjeta!.numeroTarjeta, '9999')
    ).rejects.toThrow('PIN incorrecto');
  });

  it('debería realizar un depósito correctamente', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    const cuenta = await Cuenta.findById(tarjeta?.cuentaId);

    const saldoAntes = cuenta!.saldo;
    const result = await atmService.hacerDeposito(tarjeta!.numeroTarjeta, '5678', 500);
    expect(result).toBe('Depósito realizado con éxito');

    const cuentaActualizada = await Cuenta.findById(tarjeta!.cuentaId);
    expect(cuentaActualizada?.saldo).toBe(saldoAntes + 500);
  });

  it('debería realizar un retiro correctamente', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    const cuenta = await Cuenta.findById(tarjeta?.cuentaId);

    const saldoAntes = cuenta!.saldo;
    const result = await atmService.retirarEfectivo(tarjeta!.numeroTarjeta, '5678', 200);
    expect(result).toBe('Retiro realizado con éxito');

    const cuentaActualizada = await Cuenta.findById(tarjeta!.cuentaId);
    expect(cuentaActualizada?.saldo).toBe(saldoAntes - 200);
  });

  it('debería lanzar error si los fondos son insuficientes para el retiro', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    const cuenta = await Cuenta.findById(tarjeta!.cuentaId);
  
    const saldoActual = cuenta!.saldo;
  
    await expect(
      atmService.retirarEfectivo(tarjeta!.numeroTarjeta, '5678', saldoActual + 1000)
    ).rejects.toThrow('Fondos insuficientes');
  });

  it('debería realizar un depósito a otra cuenta correctamente', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    const cuentaDestino = await Cuenta.findOne({ numeroCuenta: '123456121' });

    const saldoAntes = cuentaDestino!.saldo;
    const result = await atmService.hacerDepositoAOtraCuenta(
      tarjeta!.numeroTarjeta,
      '5678',
      cuentaDestino!.numeroCuenta,
      500
    );
    expect(result).toBe('Depósito a otra cuenta realizado con éxito');

    const cuentaDestinoActualizada = await Cuenta.findById(cuentaDestino!._id);
    expect(cuentaDestinoActualizada?.saldo).toBe(saldoAntes + 500);
  });
});
