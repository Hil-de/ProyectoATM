import { ATMService } from '../services/atm.service';

async function ejecutarPruebas() {
  const atmService = new ATMService();

  try {
    // Prueba 1: Retiro exitoso
    console.log('\nPrueba 1: Retiro exitoso');
    console.log('------------------------');
    const resultado1 = await atmService.retirarEfectivo('1234567890123456', '1234', 100);
    console.log('Resultado:', resultado1);

    // Prueba 2: Retiro con saldo insuficiente
    console.log('\nPrueba 2: Retiro con saldo insuficiente');
    console.log('------------------------');
    const resultado2 = await atmService.retirarEfectivo('1234567890123456', '1234', 10000);
    console.log('Resultado:', resultado2);

    // Prueba 3: Depósito exitoso
    console.log('\nPrueba 3: Depósito exitoso');
    console.log('------------------------');
    const resultado3 = await atmService.depositarEfectivo('1234567890123456', '1234', 500);
    console.log('Resultado:', resultado3);

    // Prueba 4: Depósito con tarjeta bloqueada
    console.log('\nPrueba 4: Depósito con tarjeta bloqueada');
    console.log('------------------------');
    const resultado4 = await atmService.depositarEfectivo('3456789012345678', '8765', 100);
    console.log('Resultado:', resultado4);

  } catch (error) {
    console.error('Error en las pruebas:', error);
  } finally {
    await atmService.cerrarConexion();
  }
}

// Ejecutar las pruebas
ejecutarPruebas(); 