import { Request, Response } from 'express';
import Tarjeta from '../models/tarjeta';

// Obtener 
export const getTarjetas = async (req: Request, res: Response) => {
  try {
    const tarjetas = await Tarjeta.find().populate('cuentaId');
    res.status(200).json(tarjetas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener tarjetas', error });
  }
};

// Obtener por ID
export const getTarjetaById = async (req: Request, res: Response) => {
  try {
    const tarjeta = await Tarjeta.findById(req.params.id).populate('cuentaId');
    if (!tarjeta) return res.status(404).json({ message: 'Tarjeta no encontrada' });
    res.status(200).json(tarjeta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarjeta', error });
  }
};

// Crear nueva
export const createTarjeta = async (req: Request, res: Response) => {
  try {
    const nuevaTarjeta = new Tarjeta(req.body);
    await nuevaTarjeta.save();
    res.status(201).json(nuevaTarjeta);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarjeta', error });
  }
};

// Actualizar 
export const updateTarjeta = async (req: Request, res: Response) => {
  try {
    const tarjetaActualizada = await Tarjeta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tarjetaActualizada) return res.status(404).json({ message: 'Tarjeta no encontrada' });
    res.status(200).json(tarjetaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarjeta', error });
  }
};

// Eliminar 
export const deleteTarjeta = async (req: Request, res: Response) => {
  try {
    const tarjetaEliminada = await Tarjeta.findByIdAndDelete(req.params.id);
    if (!tarjetaEliminada) return res.status(404).json({ message: 'Tarjeta no encontrada' });
    res.status(200).json({ message: 'Tarjeta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarjeta', error });
  }
};
