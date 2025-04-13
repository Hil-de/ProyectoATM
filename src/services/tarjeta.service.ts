import Tarjeta from '../models/tarjeta';

export class TarjetaService {
  async verificarPin(numeroTarjeta: string, pinIngresado: string): Promise<boolean> {
    const tarjeta = await Tarjeta.findOne({ numeroTarjeta });

    if (!tarjeta) {
      console.log('Tarjeta no encontrada');
      return false;
    }

    return tarjeta.pin === pinIngresado;
  }
}
