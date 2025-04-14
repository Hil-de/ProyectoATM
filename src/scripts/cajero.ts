import readline from 'readline';
import { ATMService } from '../services/atm.service';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let tarjetaValida: string | null = null;
let pinValido: string | null = null;

async function menuPrincipal() {
  if (!tarjetaValida || !pinValido) {
    await validarTarjeta();
    return;
  }

  console.log('\n=== CAJERO AUTOMÁTICO ===');
  console.log('1. Retirar efectivo');
  console.log('2. Depositar efectivo');
  console.log('3. Salir');
  
  const opcion = await new Promise<string>((resolve) => {
    rl.question('\nSeleccione una opción (1-3): ', resolve);
  });

  switch (opcion) {
    case '1':
      await retirarEfectivo();
      break;
    case '2':
      await depositarEfectivo();
      break;
    case '3':
      console.log('Gracias por usar nuestro cajero automático');
      rl.close();
      process.exit(0);
    default:
      console.log('Opción no válida');
      await menuPrincipal();
  }
}

async function validarTarjeta() {
  try {
    const numeroTarjeta = await new Promise<string>((resolve) => {
      rl.question('Ingrese el número de tarjeta: ', resolve);
    });

    const pin = await new Promise<string>((resolve) => {
      rl.question('Ingrese el PIN: ', resolve);
    });

    const atmService = new ATMService();
    const resultado = await atmService.validarTarjeta(numeroTarjeta, pin);

    console.log('\nResultado:');
    console.log('----------');
    console.log(`Estado: ${resultado.success ? 'Éxito' : 'Error'}`);
    console.log(`Mensaje: ${resultado.message}`);

    if (resultado.success && resultado.data?.cuenta) {
      console.log('\nInformación de la cuenta:');
      console.log('------------------------');
      console.log(`Número de cuenta: ${resultado.data.cuenta.numeroCuenta}`);
      console.log(`Tipo: ${resultado.data.cuenta.tipo}`);
      console.log(`Saldo: $${resultado.data.cuenta.saldo}`);
      
      // Guardar la tarjeta y PIN válidos
      tarjetaValida = numeroTarjeta;
      pinValido = pin;
      
      await atmService.cerrarConexion();
      await menuPrincipal();
    } else {
      if (resultado.data?.tarjeta) {
        console.log('\nInformación adicional:');
        console.log('--------------------');
        console.log(`Número de tarjeta: ${resultado.data.tarjeta.numeroTarjeta}`);
        if (resultado.data.tarjeta.estado) {
          console.log(`Estado: ${resultado.data.tarjeta.estado}`);
        }
        if (resultado.data.tarjeta.fechaExpiracion) {
          console.log(`Fecha de expiración: ${resultado.data.tarjeta.fechaExpiracion}`);
        }
        if (resultado.data.tarjeta.intentosRestantes !== undefined) {
          console.log(`Intentos restantes: ${resultado.data.tarjeta.intentosRestantes}`);
        }
      }

      if (resultado.error) {
        console.log('\nError:');
        console.log('------');
        console.log(resultado.error);
      }

      await atmService.cerrarConexion();
      await validarTarjeta(); // Volver a intentar
    }
  } catch (error) {
    console.error('Error:', error);
    await validarTarjeta(); // Volver a intentar
  }
}

async function retirarEfectivo() {
  try {
    if (!tarjetaValida || !pinValido) {
      console.log('Debe validar su tarjeta primero');
      await validarTarjeta();
      return;
    }

    const monto = await new Promise<string>((resolve) => {
      rl.question('Ingrese el monto a retirar: ', resolve);
    });

    const atmService = new ATMService();
    const resultado = await atmService.retirarEfectivo(tarjetaValida, pinValido, Number(monto));

    console.log('\nResultado:');
    console.log('----------');
    console.log(`Estado: ${resultado.success ? 'Éxito' : 'Error'}`);
    console.log(`Mensaje: ${resultado.message}`);

    if (resultado.success && resultado.data) {
      console.log('\nDetalles de la operación:');
      console.log('------------------------');
      console.log(`Monto retirado: $${resultado.data.monto}`);
      console.log(`Saldo anterior: $${resultado.data.saldoAnterior}`);
      console.log(`Saldo actual: $${resultado.data.saldoActual}`);
    }

    if (resultado.error) {
      console.log('\nError:');
      console.log('------');
      console.log(resultado.error);
    }

    await atmService.cerrarConexion();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await menuPrincipal();
  }
}

async function depositarEfectivo() {
  try {
    if (!tarjetaValida || !pinValido) {
      console.log('Debe validar su tarjeta primero');
      await validarTarjeta();
      return;
    }

    const monto = await new Promise<string>((resolve) => {
      rl.question('Ingrese el monto a depositar: ', resolve);
    });

    const atmService = new ATMService();
    const resultado = await atmService.depositarEfectivo(tarjetaValida, pinValido, Number(monto));

    console.log('\nResultado:');
    console.log('----------');
    console.log(`Estado: ${resultado.success ? 'Éxito' : 'Error'}`);
    console.log(`Mensaje: ${resultado.message}`);

    if (resultado.success && resultado.data) {
      console.log('\nDetalles de la operación:');
      console.log('------------------------');
      console.log(`Monto depositado: $${resultado.data.monto}`);
      console.log(`Saldo anterior: $${resultado.data.saldoAnterior}`);
      console.log(`Saldo actual: $${resultado.data.saldoActual}`);
    }

    if (resultado.error) {
      console.log('\nError:');
      console.log('------');
      console.log(resultado.error);
    }

    await atmService.cerrarConexion();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await menuPrincipal();
  }
}

// Iniciar el programa
console.log('Bienvenido al Cajero Automático');
validarTarjeta(); 