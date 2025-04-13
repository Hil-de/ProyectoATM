import { Request, Response } from 'express';
import ATM from '../models/atm';  // Modelo de cajero automático

// Obtener todos los cajeros automáticos
export const getATMs = async (req: Request, res: Response) => {
  try {
    const atms = await ATM.find();  // Obtiene todos los cajeros
    res.status(200).json(atms);  // Devuelve la lista de cajeros
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cajeros', error });
  }
};

// Obtener un cajero automático por ID
export const getATMById = async (req: Request, res: Response) => {
  try {
    const atm = await ATM.findById(req.params.id);  // Busca el cajero por ID
    if (!atm) return res.status(404).json({ message: 'Cajero no encontrado' });
    res.status(200).json(atm);  // Devuelve el cajero encontrado
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cajero', error });
  }
};

// Crear un nuevo cajero automático
export const createATM = async (req: Request, res: Response) => {
  try {
    const nuevoATM = new ATM(req.body);  // Crea un nuevo cajero con los datos del cuerpo de la solicitud
    await nuevoATM.save();  // Guarda el nuevo cajero en la base de datos
    res.status(201).json(nuevoATM);  // Devuelve el cajero recién creado
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cajero', error });
  }
};

// Actualizar un cajero automático
export const updateATM = async (req: Request, res: Response) => {
  try {
    const atmActualizado = await ATM.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Actualiza el cajero
    if (!atmActualizado) return res.status(404).json({ message: 'Cajero no encontrado' });
    res.status(200).json(atmActualizado);  // Devuelve el cajero actualizado
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cajero', error });
  }
};

// Eliminar un cajero automático
export const deleteATM = async (req: Request, res: Response) => {
  try {
    const atmEliminado = await ATM.findByIdAndDelete(req.params.id);  // Elimina el cajero por ID
    if (!atmEliminado) return res.status(404).json({ message: 'Cajero no encontrado' });
    res.status(200).json({ message: 'Cajero eliminado correctamente' });  // Mensaje de éxito
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cajero', error });
  }
};
