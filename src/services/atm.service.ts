import Tarjeta from '../models/tarjeta';
import Cuenta from '../models/cuenta';
import mongoose from 'mongoose';
import connectDB from '../config/db';

interface CuentaData {
  numeroCuenta: string;
  tipo: "debito" | "credito";
  saldo: number;
}

interface TarjetaData {
  numeroTarjeta: string;
  estado?: "activo" | "bloqueado";
  fechaExpiracion?: Date;
  intentosRestantes?: number;
}

interface ResultadoValidacion {
  success: boolean;
  message: string;
  status: number;
  data?: {
    cuenta?: CuentaData;
    tarjeta?: TarjetaData;
  };
  error?: string;
}

interface ResultadoOperacion {
  success: boolean;
  message: string;
  status: number;
  data?: {
    cuenta: CuentaData;
    monto: number;
    saldoAnterior: number;
    saldoActual: number;
  };
  error?: string;
}

export class ATMService {
  constructor() {
    // Conectar a la base de datos al crear una instancia del servicio
    this.conectarDB();
  }

  private async conectarDB() {
    try {
      await connectDB();
      console.log('Conexión a MongoDB establecida');
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
      throw error;
    }
  }

  // Validar tarjeta y PIN
  async validarTarjeta(numeroTarjeta: string, pin: string): Promise<ResultadoValidacion> {
    try {
      // Buscar la tarjeta
      const tarjeta = await Tarjeta.findOne({ numeroTarjeta });
      
      if (!tarjeta) {
        return { 
          success: false, 
          message: 'Tarjeta no encontrada',
          status: 404
        };
      }

      // Verificar si la tarjeta está bloqueada
      if (tarjeta.estado === 'bloqueado') {
        return { 
          success: false, 
          message: 'La tarjeta está bloqueada. Por favor, contacte al banco.',
          status: 403,
          data: {
            tarjeta: {
              numeroTarjeta: tarjeta.numeroTarjeta,
              estado: tarjeta.estado
            }
          }
        };
      }

      // Verificar si la tarjeta ha expirado
      if (tarjeta.fechaExpiracion < new Date()) {
        return { 
          success: false, 
          message: 'La tarjeta ha expirado. Por favor, solicite una nueva tarjeta.',
          status: 403,
          data: {
            tarjeta: {
              numeroTarjeta: tarjeta.numeroTarjeta,
              fechaExpiracion: tarjeta.fechaExpiracion
            }
          }
        };
      }

      // Verificar el PIN
      if (tarjeta.pin !== pin) {
        return { 
          success: false, 
          message: 'PIN incorrecto. Por favor, intente nuevamente.',
          status: 401,
          data: {
            tarjeta: {
              numeroTarjeta: tarjeta.numeroTarjeta,
              intentosRestantes: 2
            }
          }
        };
      }

      // Si todo es correcto, obtener información de la cuenta asociada
      const cuenta = await Cuenta.findById(tarjeta.cuentaId);
      
      if (!cuenta) {
        return { 
          success: false, 
          message: 'Cuenta no encontrada',
          status: 404
        };
      }

      // Devolver información básica de la cuenta
      return {
        success: true,
        message: 'Validación exitosa',
        status: 200,
        data: {
          cuenta: {
            numeroCuenta: cuenta.numeroCuenta,
            tipo: cuenta.tipo,
            saldo: cuenta.saldo
          }
        }
      };

    } catch (error) {
      console.error('Error en validarTarjeta:', error);
      return { 
        success: false, 
        message: 'Error al validar tarjeta', 
        error: error instanceof Error ? error.message : 'Error desconocido',
        status: 500
      };
    }
  }

  // Retirar efectivo
  async retirarEfectivo(numeroTarjeta: string, pin: string, monto: number): Promise<ResultadoOperacion> {
    try {
      // Primero validar la tarjeta
      const validacion = await this.validarTarjeta(numeroTarjeta, pin);
      
      if (!validacion.success || !validacion.data?.cuenta) {
        return {
          success: false,
          message: validacion.message,
          status: validacion.status,
          error: validacion.error
        };
      }

      const cuenta = await Cuenta.findOne({ numeroCuenta: validacion.data.cuenta.numeroCuenta });
      
      if (!cuenta) {
        return {
          success: false,
          message: 'Cuenta no encontrada',
          status: 404
        };
      }

      // Verificar saldo suficiente
      if (cuenta.saldo < monto) {
        return {
          success: false,
          message: 'Saldo insuficiente para realizar el retiro',
          status: 400,
          data: {
            cuenta: {
              numeroCuenta: cuenta.numeroCuenta,
              tipo: cuenta.tipo,
              saldo: cuenta.saldo
            },
            monto,
            saldoAnterior: cuenta.saldo,
            saldoActual: cuenta.saldo
          }
        };
      }

      // Realizar el retiro
      const saldoAnterior = cuenta.saldo;
      cuenta.saldo -= monto;
      await cuenta.save();

      return {
        success: true,
        message: 'Retiro exitoso',
        status: 200,
        data: {
          cuenta: {
            numeroCuenta: cuenta.numeroCuenta,
            tipo: cuenta.tipo,
            saldo: cuenta.saldo
          },
          monto,
          saldoAnterior,
          saldoActual: cuenta.saldo
        }
      };

    } catch (error) {
      console.error('Error en retirarEfectivo:', error);
      return {
        success: false,
        message: 'Error al realizar el retiro',
        error: error instanceof Error ? error.message : 'Error desconocido',
        status: 500
      };
    }
  }

  // Depositar efectivo
  async depositarEfectivo(numeroTarjeta: string, pin: string, monto: number): Promise<ResultadoOperacion> {
    try {
      // Primero validar la tarjeta
      const validacion = await this.validarTarjeta(numeroTarjeta, pin);
      
      if (!validacion.success || !validacion.data?.cuenta) {
        return {
          success: false,
          message: validacion.message,
          status: validacion.status,
          error: validacion.error
        };
      }

      const cuenta = await Cuenta.findOne({ numeroCuenta: validacion.data.cuenta.numeroCuenta });
      
      if (!cuenta) {
        return {
          success: false,
          message: 'Cuenta no encontrada',
          status: 404
        };
      }

      // Realizar el depósito
      const saldoAnterior = cuenta.saldo;
      cuenta.saldo += monto;
      await cuenta.save();

      return {
        success: true,
        message: 'Depósito exitoso',
        status: 200,
        data: {
          cuenta: {
            numeroCuenta: cuenta.numeroCuenta,
            tipo: cuenta.tipo,
            saldo: cuenta.saldo
          },
          monto,
          saldoAnterior,
          saldoActual: cuenta.saldo
        }
      };

    } catch (error) {
      console.error('Error en depositarEfectivo:', error);
      return {
        success: false,
        message: 'Error al realizar el depósito',
        error: error instanceof Error ? error.message : 'Error desconocido',
        status: 500
      };
    }
  }

  // Método para cerrar la conexión a la base de datos
  async cerrarConexion() {
    try {
      await mongoose.connection.close();
      console.log('Conexión a MongoDB cerrada');
    } catch (error) {
      console.error('Error al cerrar la conexión a MongoDB:', error);
      throw error;
    }
  }
} 