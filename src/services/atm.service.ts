// src/services/atm.service.ts
import Tarjeta from '../models/tarjeta';
import Cuenta from '../models/cuenta';
import Transaccion from '../models/transaccion';
import logger from '../config/logger';

export class ATMService {
  async verificarPin(numeroTarjeta: string, pinIngresado: string): Promise<boolean> {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });

    if (!tarjeta) {
      logger.warn(`Tarjeta no encontrada: ${numeroTarjeta}`);
      return false;
    }

    if (tarjeta.estado !== 'activo') {
      logger.warn(`Tarjeta bloqueada o inactiva: ${numeroTarjeta}`);
      return false;
    }

    if (tarjeta.pin === pinIngresado) {
      logger.info(`PIN verificado correctamente para la tarjeta: ${numeroTarjeta}`);
      return true;
    } else {
      logger.error(`PIN incorrecto para la tarjeta: ${numeroTarjeta}`);
      return false;
    }
  }

  async consultarSaldo(numeroTarjeta: string, pin: string): Promise<number> {
    logger.info(`Consultando saldo de la tarjeta: ${numeroTarjeta}`);

    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });
    if (!tarjeta) {
      logger.error(`Tarjeta no encontrada: ${numeroTarjeta}`);
      throw new Error('Tarjeta no encontrada');
    }

    if (tarjeta.pin !== pin) {
      logger.error(`PIN incorrecto al consultar saldo: ${numeroTarjeta}`);
      throw new Error('PIN incorrecto');
    }

    const cuenta = await Cuenta.findById(tarjeta.cuentaId);
    if (!cuenta) {
      logger.error(`Cuenta asociada no encontrada: ${tarjeta.cuentaId}`);
      throw new Error('Cuenta no encontrada');
    }

    logger.info(`Saldo consultado correctamente para tarjeta ${numeroTarjeta}: ${cuenta.saldo}`);
    return cuenta.saldo;
  }

  async hacerDeposito(numeroTarjeta: string, pin: string, monto: number): Promise<string> {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });

    if (!tarjeta) {
      logger.error(`Tarjeta no encontrada: ${numeroTarjeta}`);
      throw new Error('Tarjeta no encontrada');
    }
    if (tarjeta.estado !== 'activo') {
      logger.error(`Tarjeta inactiva o bloqueada: ${numeroTarjeta}`);
      throw new Error('Tarjeta inactiva o bloqueada');
    }

    if (tarjeta.pin !== pin) {
      logger.error(`PIN incorrecto para la tarjeta: ${numeroTarjeta}`);
      await Transaccion.create({
        tipo: 'depósito',
        monto,
        resultado: 'fallido',
        tarjetaId: tarjeta._id,
      });
      throw new Error('PIN incorrecto');
    }

    const cuenta = await Cuenta.findById(tarjeta.cuentaId);
    if (!cuenta) {
      logger.error(`Cuenta no encontrada para la tarjeta: ${numeroTarjeta}`);
      throw new Error('Cuenta asociada no encontrada');
    }

    cuenta.saldo += monto;
    await cuenta.save();

    await Transaccion.create({
      tipo: 'depósito',
      monto,
      resultado: 'exitoso',
      tarjetaId: tarjeta._id,
    });

    logger.info(`Depósito de ${monto} realizado con éxito en la tarjeta: ${numeroTarjeta}`);
    return 'Depósito realizado con éxito';
  }

  async hacerDepositoAOtraCuenta(
    numeroTarjeta: string,
    pin: string,
    numeroCuentaDestino: string,
    monto: number
  ): Promise<string> {
    logger.info(`Iniciando depósito desde tarjeta ${numeroTarjeta} hacia cuenta ${numeroCuentaDestino}`);

    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });
    if (!tarjeta) {
      logger.error(`Tarjeta no encontrada: ${numeroTarjeta}`);
      throw new Error('Tarjeta no encontrada');
    }

    if (tarjeta.pin !== pin) {
      logger.error(`PIN incorrecto para la tarjeta: ${numeroTarjeta}`);
      throw new Error('PIN incorrecto');
    }

    const cuentaOrigen = await Cuenta.findById(tarjeta.cuentaId);
    if (!cuentaOrigen) {
      logger.error(`Cuenta de origen no encontrada: ${tarjeta.cuentaId}`);
      throw new Error('Cuenta de origen no encontrada');
    }

    if (cuentaOrigen.saldo < monto) {
      logger.error(`Fondos insuficientes en cuenta origen: ${cuentaOrigen.numeroCuenta}`);
      throw new Error('Fondos insuficientes');
    }

    const cuentaDestino = await Cuenta.findOne({ numeroCuenta: numeroCuentaDestino });
    if (!cuentaDestino) {
      logger.error(`Cuenta de destino no encontrada: ${numeroCuentaDestino}`);
      throw new Error('Cuenta de destino no encontrada');
    }

    cuentaOrigen.saldo -= monto;
    cuentaDestino.saldo += monto;

    await cuentaOrigen.save();
    await cuentaDestino.save();

    await Transaccion.create({
      tipo: 'depósito',
      monto,
      resultado: 'exitoso',
      tarjetaId: tarjeta._id,
    });

    logger.info(`Depósito a otra cuenta realizado exitosamente`);
    return 'Depósito a otra cuenta realizado con éxito';
  }

  async retirarEfectivo(numeroTarjeta: string, pin: string, monto: number): Promise<string> {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });

    if (!tarjeta) {
      logger.error(`Tarjeta no encontrada: ${numeroTarjeta}`);
      throw new Error('Tarjeta no encontrada');
    }

    if (tarjeta.estado !== 'activo') {
      logger.error(`Tarjeta inactiva o bloqueada: ${numeroTarjeta}`);
      throw new Error('Tarjeta inactiva o bloqueada');
    }

    if (tarjeta.pin !== pin) {
      logger.error(`PIN incorrecto para la tarjeta: ${numeroTarjeta}`);
      await Transaccion.create({
        tipo: 'retiro',
        monto,
        resultado: 'fallido',
        tarjetaId: tarjeta._id,
      });
      throw new Error('PIN incorrecto');
    }

    const cuenta = await Cuenta.findById(tarjeta.cuentaId);
    if (!cuenta) {
      logger.error(`Cuenta no encontrada para la tarjeta: ${numeroTarjeta}`);
      throw new Error('Cuenta asociada no encontrada');
    }

    if (cuenta.saldo < monto) {
      logger.error(`Fondos insuficientes para el retiro en la cuenta: ${cuenta.numeroCuenta}`);
      await Transaccion.create({
        tipo: 'retiro',
        monto,
        resultado: 'fallido',
        tarjetaId: tarjeta._id,
      });
      throw new Error('Fondos insuficientes');
    }

    cuenta.saldo -= monto;
    await cuenta.save();

    await Transaccion.create({
      tipo: 'retiro',
      monto,
      resultado: 'exitoso',
      tarjetaId: tarjeta._id,
    });

    logger.info(`Retiro de ${monto} realizado con éxito en la tarjeta: ${numeroTarjeta}`);
    return 'Retiro realizado con éxito';
  }
}
