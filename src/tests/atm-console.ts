import promptSync from 'prompt-sync';
import connectDB from '../config/db';
import { ATMService } from '../services/atm.service';

const prompt = promptSync();

async function main() {
  await connectDB();

  const atmService = new ATMService();

  const numeroTarjeta = prompt('Ingrese el número de su tarjeta: ');
  const pin = prompt('Ingrese su PIN: ');

  const pinVerificado = await atmService.verificarPin(numeroTarjeta, pin);
  if (!pinVerificado) {
    console.log('PIN incorrecto. Transacción cancelada.');
    return;
  }

  console.log('\nSeleccione una opción:');
  console.log('1. Consultar saldo');
  console.log('2. Hacer depósito');
  console.log('3. Retirar efectivo');

  const opcion = prompt('Opción (1/2/3): ');

  if (opcion === '1') {
    try {
      const saldo = await atmService.consultarSaldo(numeroTarjeta, pin);
      console.log(`Su saldo actual es: RD$ ${saldo.toFixed(2)}`);
    } catch (error) {
      console.error('Error al consultar saldo:', error instanceof Error ? error.message : 'Unknown error');
    }

  } else if (opcion === '2') {
    const tipoDeposito = prompt('¿Desea hacer el depósito a la misma cuenta o a otra cuenta? (mismo/otra): ').toLowerCase();
    let numeroCuentaDestino: string | null = null;

    if (tipoDeposito === 'otra') {
      numeroCuentaDestino = prompt('Ingrese el número de cuenta de destino: ');
    }

    const monto = parseFloat(prompt('Ingrese el monto a depositar: '));

    if (tipoDeposito === 'mismo') {
      // Pedir que el usuario ingrese el dinero en el cajero
      const dineroInsertado = parseFloat(prompt('Inserte el dinero en el cajero (monto que desea depositar): '));

      if (dineroInsertado !== monto) {
        console.log('El monto ingresado en el cajero no coincide con el monto solicitado. Transacción cancelada.');
        return;
      }

      try {
        const resultado = await atmService.hacerDeposito(numeroTarjeta, pin, monto);
        console.log(resultado);
      } catch (error) {
        console.error('Error al realizar depósito:', error instanceof Error ? error.message : 'Unknown error');
      }

    } else if (tipoDeposito === 'otra' && numeroCuentaDestino) {
      try {
        const resultado = await atmService.hacerDepositoAOtraCuenta(numeroTarjeta, pin, numeroCuentaDestino, monto);
        console.log(resultado);
      } catch (error) {
        console.error('Error al realizar depósito a otra cuenta:', error instanceof Error ? error.message : 'Unknown error');
      }
    } else {
      console.log('Opción no válida. Transacción cancelada.');
    }

  } else if (opcion === '3') {
    const monto = parseFloat(prompt('Ingrese el monto a retirar: '));

    try {
      const resultado = await atmService.retirarEfectivo(numeroTarjeta, pin, monto);
      console.log(resultado);
    } catch (error) {
      console.error('Error al retirar efectivo:', error instanceof Error ? error.message : 'Unknown error');
    }

  } else {
    console.log('Opción no válida. Transacción cancelada.');
  }

  process.exit();
}

main();
