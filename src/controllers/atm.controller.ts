import { Request, Response } from 'express';
import { ATMService } from '../services/atm.service';

const atmService = new ATMService();

// Validar tarjeta y PIN
export const validarTarjeta = async (req: Request, res: Response) => {
  const { numeroTarjeta, pin } = req.body;
  const resultado = await atmService.validarTarjeta(numeroTarjeta, pin);
  res.status(resultado.status).json(resultado);
}; 