import { Request, Response } from 'express';
import Cuenta from '../models/cuenta'; // Asegúrate de tener el modelo creado

// Obtener todas las cuentas
export const getCuentas = async (req: Request, res: Response) => {
  try {
    const cuentas = await Cuenta.find().populate('clienteId'); // para mostrar datos del cliente
    res.status(200).json(cuentas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cuentas', error });
  }
};

// Obtener cuenta por ID
export const getCuentaById = async (req: Request, res: Response) => {
  try {
    const cuenta = await Cuenta.findById(req.params.id).populate('clienteId');
    if (!cuenta) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.status(200).json(cuenta);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la cuenta', error });
  }
};

// Crear nueva cuenta
export const createCuenta = async (req: Request, res: Response) => {
  try {
    const nuevaCuenta = new Cuenta(req.body);
    await nuevaCuenta.save();
    res.status(201).json(nuevaCuenta);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cuenta', error });
  }
};

// Actualizar cuenta
export const updateCuenta = async (req: Request, res: Response) => {
  try {
    const cuentaActualizada = await Cuenta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cuentaActualizada) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.status(200).json(cuentaActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cuenta', error });
  }
};

// Eliminar cuenta
export const deleteCuenta = async (req: Request, res: Response) => {
  try {
    const cuentaEliminada = await Cuenta.findByIdAndDelete(req.params.id);
    if (!cuentaEliminada) return res.status(404).json({ message: 'Cuenta no encontrada' });
    res.status(200).json({ message: 'Cuenta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cuenta', error });
  }
};
