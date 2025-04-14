import promptSync from 'prompt-sync';
import connectDB from '../config/db';
import { ATMService } from '../services/atm.service';

const prompt = promptSync();

async function main() {
  // Conectar a la base de datos
  await connectDB();

  const atmService = new ATMService();

  const numeroTarjeta = prompt('Ingrese el número de su tarjeta: ');
  const pin = prompt('Ingrese su PIN: ');

  const pinVerificado = await atmService.verificarPin(numeroTarjeta, pin);

  if (!pinVerificado) {
    console.log('PIN incorrecto. Transacción cancelada.');
    return;
  }

  // Preguntar si el depósito es a la misma cuenta o a otra cuenta
  const tipoDeposito = prompt('¿Desea hacer el depósito a la misma cuenta o a otra cuenta? (mismo/otra): ').toLowerCase();

  let numeroCuentaDestino: string | null = null;
  let monto: number;

  if (tipoDeposito === 'otra') {
    numeroCuentaDestino = prompt('Ingrese el número de cuenta de destino: ');
  }

  // Solicitar el monto a depositar
  monto = parseFloat(prompt('Ingrese el monto a depositar: '));

  // Realizar el depósito según la opción seleccionada
  try {
    if (tipoDeposito === 'mismo') {
      const resultado = await atmService.hacerDeposito(numeroTarjeta, pin, monto);
      console.log(resultado);
    } else if (tipoDeposito === 'otra' && numeroCuentaDestino) {
      const resultado = await atmService.hacerDepositoAOtraCuenta(numeroTarjeta, pin, numeroCuentaDestino, monto);
      console.log(resultado);
    } else {
      console.log('Opción no válida. Transacción cancelada.');
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  }

  process.exit();
}

main();
