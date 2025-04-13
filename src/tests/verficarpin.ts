// tests/testVerificarPin.ts

import connectDB from '../config/db';
import { TarjetaService } from '../services/tarjeta.service';
import mongoose from 'mongoose';
import readline from 'readline-sync';

async function main() {
  await connectDB();

  const tarjetaService = new TarjetaService();

  // Leer datos desde consola
  const numeroTarjeta = readline.question('Ingrese el número de tarjeta: ');
  const pin = readline.question('Ingrese el PIN: ', { hideEchoBack: true });

  const valido = await tarjetaService.verificarPin(numeroTarjeta, pin);

  if (valido) {
    console.log('✅ PIN correcto. Acceso concedido.');
  } else {
    console.log('❌ PIN incorrecto o tarjeta no encontrada.');
  }

  await mongoose.disconnect();
}

main().catch(console.error);
