// src/controllers/atm.controller.ts

import { Request, Response } from 'express';
import { ATMService } from '../services/atm.service';

const atmService = new ATMService();

export const hacerDeposito = async (req: Request, res: Response) => {
  const { numeroTarjeta, pin, monto } = req.body;
  try {
    const mensaje = await atmService.hacerDeposito(numeroTarjeta, pin, monto);
    res.status(200).json({ mensaje });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const retirarEfectivo = async (req: Request, res: Response) => {
  const { numeroTarjeta, pin, monto } = req.body;
  try {
    const mensaje = await atmService.retirarEfectivo(numeroTarjeta, pin, monto);
    res.status(200).json({ mensaje });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
