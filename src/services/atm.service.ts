// src/services/atm.service.ts

import Tarjeta from '../models/tarjeta';
import Cuenta from '../models/cuenta';
import Transaccion from '../models/transaccion';

export class ATMService {
  async verificarPin(numeroTarjeta: string, pinIngresado: string): Promise<boolean> {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });

    if (!tarjeta) {
      console.log('Tarjeta no encontrada');
      return false;
    }

    if (tarjeta.estado !== 'activo') {
      console.log('Tarjeta bloqueada o inactiva');
      return false;
    }

    return tarjeta.pin === pinIngresado;
  }

  async hacerDeposito(numeroTarjeta: string, pin: string, monto: number): Promise<string> {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });

    if (!tarjeta) throw new Error('Tarjeta no encontrada');
    if (tarjeta.estado !== 'activo') throw new Error('Tarjeta inactiva o bloqueada');

    if (tarjeta.pin !== pin) {
      await Transaccion.create({
        tipo: 'depósito',
        monto,
        resultado: 'fallido',
        tarjetaId: tarjeta._id,
      });
      throw new Error('PIN incorrecto');
    }

    const cuenta = await Cuenta.findById(tarjeta.cuentaId);
    if (!cuenta) throw new Error('Cuenta asociada no encontrada');

    cuenta.saldo += monto;
    await cuenta.save();

    await Transaccion.create({
      tipo: 'depósito',
      monto,
      resultado: 'exitoso',
      tarjetaId: tarjeta._id,
    });

    return 'Depósito realizado con éxito';
  }

  async retirarEfectivo(numeroTarjeta: string, pin: string, monto: number): Promise<string> {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });

    if (!tarjeta) throw new Error('Tarjeta no encontrada');
    if (tarjeta.estado !== 'activo') throw new Error('Tarjeta inactiva o bloqueada');

    if (tarjeta.pin !== pin) {
      await Transaccion.create({
        tipo: 'retiro',
        monto,
        resultado: 'fallido',
        tarjetaId: tarjeta._id,
      });
      throw new Error('PIN incorrecto');
    }

    const cuenta = await Cuenta.findById(tarjeta.cuentaId);
    if (!cuenta) throw new Error('Cuenta asociada no encontrada');

    if (cuenta.saldo < monto) {
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

    return 'Retiro realizado con éxito';
  }

  async hacerDepositoAOtraCuenta(numeroTarjeta: string, pin: string, numeroCuentaDestino: string, monto: number): Promise<string> {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });
    if (!tarjeta) throw new Error('Tarjeta no encontrada');
    if (tarjeta.estado !== 'activo') throw new Error('Tarjeta inactiva o bloqueada');

    if (tarjeta.pin !== pin) {
      await Transaccion.create({
        tipo: 'depósito externo',
        monto,
        resultado: 'fallido',
        tarjetaId: tarjeta._id,
      });
      throw new Error('PIN incorrecto');
    }

    const cuentaOrigen = await Cuenta.findById(tarjeta.cuentaId);
    if (!cuentaOrigen) throw new Error('Cuenta de origen no encontrada');

    const cuentaDestino = await Cuenta.findOne({ numeroCuenta: numeroCuentaDestino });
    if (!cuentaDestino) throw new Error('Cuenta de destino no encontrada');

    if (cuentaOrigen.saldo < monto) {
      await Transaccion.create({
        tipo: 'depósito externo',
        monto,
        resultado: 'fallido',
        tarjetaId: tarjeta._id,
      });
      throw new Error('Fondos insuficientes para transferencia');
    }

    // Realizar transferencia
    cuentaOrigen.saldo -= monto;
    cuentaDestino.saldo += monto;

    await cuentaOrigen.save();
    await cuentaDestino.save();

    await Transaccion.create({
      tipo: 'depósito externo',
      monto,
      resultado: 'exitoso',
      tarjetaId: tarjeta._id,
    });

    return 'Depósito a otra cuenta realizado con éxito';
  }
}
