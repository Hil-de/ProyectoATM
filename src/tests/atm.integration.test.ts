// src/tests/atm.integration.test.ts
import mongoose from 'mongoose';
import connectDB from '../config/db';
import Tarjeta from '../models/tarjeta';
import Cuenta from '../models/cuenta';
import { ATMService } from '../services/atm.service';

describe('Pruebas integrales de ATMService', () => {
  let atmService: ATMService;

  beforeAll(async () => {
    await connectDB();
    atmService = new ATMService();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('debería verificar correctamente el PIN desde la base de datos', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    expect(tarjeta).not.toBeNull();

    const result = await atmService.verificarPin(tarjeta?.numeroTarjeta || '', '5678');
    expect(result).toBe(true);
  });

  it('debería consultar el saldo real de la cuenta asociada a la tarjeta', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    expect(tarjeta).not.toBeNull();

    const cuenta = await Cuenta.findOne({ _id: tarjeta?.cuentaId });
    expect(cuenta).not.toBeNull();

    const saldo = await atmService.consultarSaldo(tarjeta?.numeroTarjeta || '', '5678');
    expect(saldo).toBe(cuenta?.saldo);
  });

  it('debería lanzar error si el PIN es incorrecto', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    expect(tarjeta).not.toBeNull();

    await expect(atmService.consultarSaldo(tarjeta?.numeroTarjeta || '', '9999')).rejects.toThrow('PIN incorrecto');
  });

  it('debería realizar un depósito correctamente', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    expect(tarjeta).not.toBeNull();

    const cuenta = await Cuenta.findOne({ _id: tarjeta?.cuentaId });
    expect(cuenta).not.toBeNull();

    const saldoAntes = cuenta?.saldo;

    const result = await atmService.hacerDeposito(tarjeta?.numeroTarjeta || '', '5678', 500);
    expect(result).toBe('Depósito realizado con éxito');

    const cuentaActualizada = await Cuenta.findOne({ _id: tarjeta?.cuentaId });
    expect(cuentaActualizada?.saldo).toBe(saldoAntes! + 500); // El saldo debería aumentar en 500
  });

  it('debería realizar un retiro correctamente', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    expect(tarjeta).not.toBeNull();

    const cuenta = await Cuenta.findOne({ _id: tarjeta?.cuentaId });
    expect(cuenta).not.toBeNull();

    const saldoAntes = cuenta?.saldo;

    const result = await atmService.retirarEfectivo(tarjeta?.numeroTarjeta || '', '5678', 200);
    expect(result).toBe('Retiro realizado con éxito');

    const cuentaActualizada = await Cuenta.findOne({ _id: tarjeta?.cuentaId });
    expect(cuentaActualizada?.saldo).toBe(saldoAntes! - 200); // El saldo debería disminuir en 200
  });

  it('debería lanzar error si los fondos son insuficientes para el retiro', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    expect(tarjeta).not.toBeNull();

    const result = await expect(atmService.retirarEfectivo(tarjeta?.numeroTarjeta || '', '5678', 4000));
    await result.rejects.toThrow('Fondos insuficientes');
  });

  it('debería realizar un depósito a otra cuenta correctamente', async () => {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta: '98765432120932039' });
    expect(tarjeta).not.toBeNull();

    const cuentaDestino = await Cuenta.findOne({ numeroCuenta: '123456121' }); // Otra cuenta preexistente
    expect(cuentaDestino).not.toBeNull();

    const saldoDestinoAntes = cuentaDestino?.saldo;

    const result = await atmService.hacerDeposito(tarjeta?.numeroTarjeta || '', '5678', 500);
    expect(result).toBe('Depósito realizado con éxito');

    const cuentaDestinoActualizada = await Cuenta.findOne({ _id: cuentaDestino?._id });
    expect(cuentaDestinoActualizada?.saldo).toBe(saldoDestinoAntes! + 500); // El saldo de la cuenta destino debe aumentar en 500
  });
});
