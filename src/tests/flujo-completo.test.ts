import { ATMService } from '../services/atm.service';

async function ejecutarFlujoCompleto() {
  const atmService = new ATMService();

  try {
    console.log('=== INICIO DE PRUEBA DE FLUJO COMPLETO ===\n');

    // 1. Validación de tarjeta válida
    console.log('1. Validación de tarjeta válida');
    console.log('------------------------------');
    const validacion1 = await atmService.validarTarjeta('1234567890123456', '1234');
    console.log('Resultado:', validacion1);
    if (!validacion1.success) {
      throw new Error('Error en validación de tarjeta válida');
    }
    console.log('Saldo inicial:', validacion1.data?.cuenta?.saldo, '\n');

    // 2. Retiro exitoso
    console.log('2. Retiro exitoso');
    console.log('----------------');
    const retiro1 = await atmService.retirarEfectivo('1234567890123456', '1234', 200);
    console.log('Resultado:', retiro1);
    if (!retiro1.success) {
      throw new Error('Error en retiro exitoso');
    }
    console.log('Saldo después del retiro:', retiro1.data?.saldoActual, '\n');

    // 3. Intento de retiro con saldo insuficiente
    console.log('3. Intento de retiro con saldo insuficiente');
    console.log('-----------------------------------------');
    const retiro2 = await atmService.retirarEfectivo('1234567890123456', '1234', 2000);
    console.log('Resultado:', retiro2);
    if (retiro2.success) {
      throw new Error('Error: Se permitió retiro con saldo insuficiente');
    }
    console.log('Saldo actual:', retiro2.data?.saldoActual, '\n');

    // 4. Depósito exitoso
    console.log('4. Depósito exitoso');
    console.log('------------------');
    const deposito1 = await atmService.depositarEfectivo('1234567890123456', '1234', 500);
    console.log('Resultado:', deposito1);
    if (!deposito1.success) {
      throw new Error('Error en depósito exitoso');
    }
    console.log('Saldo después del depósito:', deposito1.data?.saldoActual, '\n');

    // 5. Validación de tarjeta bloqueada
    console.log('5. Validación de tarjeta bloqueada');
    console.log('--------------------------------');
    const validacion2 = await atmService.validarTarjeta('3456789012345678', '8765');
    console.log('Resultado:', validacion2);
    if (validacion2.success) {
      throw new Error('Error: Se permitió acceso con tarjeta bloqueada');
    }
    console.log('\n');

    // 6. Intento de depósito con tarjeta bloqueada
    console.log('6. Intento de depósito con tarjeta bloqueada');
    console.log('-----------------------------------------');
    const deposito2 = await atmService.depositarEfectivo('3456789012345678', '8765', 100);
    console.log('Resultado:', deposito2);
    if (deposito2.success) {
      throw new Error('Error: Se permitió depósito con tarjeta bloqueada');
    }
    console.log('\n');

    // 7. Validación de tarjeta con PIN incorrecto
    console.log('7. Validación de tarjeta con PIN incorrecto');
    console.log('----------------------------------------');
    const validacion3 = await atmService.validarTarjeta('1234567890123456', '0000');
    console.log('Resultado:', validacion3);
    if (validacion3.success) {
      throw new Error('Error: Se permitió acceso con PIN incorrecto');
    }
    console.log('\n');

    // 8. Intento de retiro con PIN incorrecto
    console.log('8. Intento de retiro con PIN incorrecto');
    console.log('-------------------------------------');
    const retiro3 = await atmService.retirarEfectivo('1234567890123456', '0000', 100);
    console.log('Resultado:', retiro3);
    if (retiro3.success) {
      throw new Error('Error: Se permitió retiro con PIN incorrecto');
    }
    console.log('\n');

    // 9. Validación de tarjeta no existente
    console.log('9. Validación de tarjeta no existente');
    console.log('-----------------------------------');
    const validacion4 = await atmService.validarTarjeta('9999999999999999', '1234');
    console.log('Resultado:', validacion4);
    if (validacion4.success) {
      throw new Error('Error: Se permitió acceso con tarjeta no existente');
    }
    console.log('\n');

    // 10. Intento de depósito con tarjeta no existente
    console.log('10. Intento de depósito con tarjeta no existente');
    console.log('---------------------------------------------');
    const deposito3 = await atmService.depositarEfectivo('9999999999999999', '1234', 100);
    console.log('Resultado:', deposito3);
    if (deposito3.success) {
      throw new Error('Error: Se permitió depósito con tarjeta no existente');
    }

    console.log('\n=== FIN DE PRUEBA DE FLUJO COMPLETO ===');
    console.log('Todas las pruebas se ejecutaron correctamente');

  } catch (error) {
    console.error('\nError en el flujo de pruebas:', error);
  } finally {
    await atmService.cerrarConexion();
  }
}

// Ejecutar el flujo completo
ejecutarFlujoCompleto(); 