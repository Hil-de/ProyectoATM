import mongoose from 'mongoose';
import Cliente from '../../models/clientes';
import Cuenta from '../../models/cuenta';
import Tarjeta from '../../models/tarjeta';

const seedDB = async () => {
  try {
    // Conectar a la base de datos
    await mongoose.connect('mongodb://admin:password@localhost:27017/atm_db?authSource=admin');
    console.log('Conectado a MongoDB');

    // Limpiar la base de datos
    await Cliente.deleteMany({});
    await Cuenta.deleteMany({});
    await Tarjeta.deleteMany({});

    // Crear clientes
    const clientes = [
      {
        nombre: 'Juan Pérez',
        documento: '12345678',
        email: 'juan@ejemplo.com',
        telefono: '1234567890'
      },
      {
        nombre: 'María García',
        documento: '87654321',
        email: 'maria@ejemplo.com',
        telefono: '0987654321'
      },
      {
        nombre: 'Carlos López',
        documento: '11223344',
        email: 'carlos@ejemplo.com',
        telefono: '1122334455'
      }
    ];

    const clientesGuardados = await Promise.all(
      clientes.map(cliente => new Cliente(cliente).save())
    );

    // Crear cuentas para cada cliente
    const cuentas = [
      // Cuentas de Juan
      {
        numeroCuenta: '1234567890',
        tipo: 'debito',
        saldo: 1000,
        clienteId: clientesGuardados[0]._id
      },
      {
        numeroCuenta: '1234567891',
        tipo: 'credito',
        saldo: 5000,
        clienteId: clientesGuardados[0]._id
      },
      // Cuentas de María
      {
        numeroCuenta: '2345678901',
        tipo: 'debito',
        saldo: 2500,
        clienteId: clientesGuardados[1]._id
      },
      // Cuentas de Carlos
      {
        numeroCuenta: '3456789012',
        tipo: 'debito',
        saldo: 3000,
        clienteId: clientesGuardados[2]._id
      }
    ];

    const cuentasGuardadas = await Promise.all(
      cuentas.map(cuenta => new Cuenta(cuenta).save())
    );

    // Crear tarjetas para cada cuenta
    const tarjetas = [
      // Tarjetas de Juan
      {
        numeroTarjeta: '1234567890123456',
        pin: '1234',
        estado: 'activo',
        fechaExpiracion: new Date('2025-12-31'),
        cuentaId: cuentasGuardadas[0]._id
      },
      {
        numeroTarjeta: '1234567890123457',
        pin: '5678',
        estado: 'activo',
        fechaExpiracion: new Date('2025-12-31'),
        cuentaId: cuentasGuardadas[1]._id
      },
      // Tarjetas de María
      {
        numeroTarjeta: '2345678901234567',
        pin: '4321',
        estado: 'activo',
        fechaExpiracion: new Date('2025-12-31'),
        cuentaId: cuentasGuardadas[2]._id
      },
      // Tarjetas de Carlos
      {
        numeroTarjeta: '3456789012345678',
        pin: '8765',
        estado: 'bloqueado', // Tarjeta bloqueada para prueba
        fechaExpiracion: new Date('2025-12-31'),
        cuentaId: cuentasGuardadas[3]._id
      }
    ];

    await Promise.all(tarjetas.map(tarjeta => new Tarjeta(tarjeta).save()));

    console.log('Datos de prueba insertados correctamente');
    console.log('\nDatos creados:');
    console.log('--------------');
    console.log('Clientes:');
    clientesGuardados.forEach(cliente => {
      console.log(`- ${cliente.nombre} (${cliente.documento})`);
    });
    console.log('\nCuentas:');
    cuentasGuardadas.forEach(cuenta => {
      console.log(`- ${cuenta.numeroCuenta} (${cuenta.tipo}): $${cuenta.saldo}`);
    });
    console.log('\nTarjetas:');
    tarjetas.forEach(tarjeta => {
      console.log(`- ${tarjeta.numeroTarjeta} (${tarjeta.estado})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error al insertar datos de prueba:', error);
    process.exit(1);
  }
};

seedDB(); 