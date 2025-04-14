import { ATMService } from '../services/atm.service';

async function ejecutarPruebas() {
  const atmService = new ATMService();

  try {
    // Prueba 1: Tarjeta válida
    console.log('\nPrueba 1: Tarjeta válida');
    console.log('------------------------');
    const resultado1 = await atmService.validarTarjeta('1234567890123456', '1234');
    console.log('Resultado:', resultado1);

    // Prueba 2: Tarjeta bloqueada
    console.log('\nPrueba 2: Tarjeta bloqueada');
    console.log('------------------------');
    const resultado2 = await atmService.validarTarjeta('3456789012345678', '8765');
    console.log('Resultado:', resultado2);

    // Prueba 3: PIN incorrecto
    console.log('\nPrueba 3: PIN incorrecto');
    console.log('------------------------');
    const resultado3 = await atmService.validarTarjeta('1234567890123456', '0000');
    console.log('Resultado:', resultado3);

    // Prueba 4: Tarjeta no existente
    console.log('\nPrueba 4: Tarjeta no existente');
    console.log('------------------------');
    const resultado4 = await atmService.validarTarjeta('9999999999999999', '1234');
    console.log('Resultado:', resultado4);

  } catch (error) {
    console.error('Error en las pruebas:', error);
  } finally {
    await atmService.cerrarConexion();
  }
}

// Ejecutar las pruebas
ejecutarPruebas(); 