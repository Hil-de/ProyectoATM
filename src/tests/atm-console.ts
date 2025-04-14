import readline from 'readline';
import connectDB from '../config/db';
import mongoose from 'mongoose';
import { ATMService } from '../services/atm.service';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const atmService = new ATMService();

function preguntar(pregunta: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(pregunta, resolve);
  });
}

async function main() {
  try {
    await connectDB();

    const numeroTarjeta = await preguntar('🔢 Ingrese el número de tarjeta: ');
    const pin = await preguntar('🔐 Ingrese el PIN: ');

    const pinValido = await atmService.verificarPin(numeroTarjeta, pin);
    if (!pinValido) {
      console.log('❌ PIN incorrecto o tarjeta no encontrada.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    console.log('\n✅ PIN verificado.');
    const accion = await preguntar('¿Qué desea hacer? (deposito/retiro): ');
    const montoStr = await preguntar('💰 Ingrese el monto: ');
    const monto = parseFloat(montoStr);

    let mensaje = '';

    if (accion.toLowerCase() === 'deposito') {
      mensaje = await atmService.hacerDeposito(numeroTarjeta, pin, monto);
    } else if (accion.toLowerCase() === 'retiro') {
      mensaje = await atmService.retirarEfectivo(numeroTarjeta, pin, monto);
    } else {
      console.log('❌ Acción no válida.');
      rl.close();
      await mongoose.disconnect();
      return;
    }

    console.log('✅ Resultado:', mensaje);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

main();
