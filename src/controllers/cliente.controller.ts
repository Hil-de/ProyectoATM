import { Request, Response } from 'express';
import Cliente from '../models/cliente'; 

// Obtener
export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.find(); 
    res.json(clientes); 
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error });
  }
};

// Obtener por ID
export const getClienteById = async (req: Request, res: Response) => {
  try {
    const cliente = await Cliente.findById(req.params.id); 
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente); 
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error });
  }
};

// Crear nuevo 
export const createCliente = async (req: Request, res: Response) => {
  try {
    const { nombre, documento, email, telefono } = req.body; 
    const nuevoCliente = new Cliente({ nombre, documento, email, telefono }); 
    await nuevoCliente.save(); 
    res.status(201).json(nuevoCliente); 
  } catch (error) {
    res.status(500).json({ message: "Error al crear el cliente", error });
  }
};

// Actualizar
export const updateCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente); 
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el cliente", error });
  }
};

// Eliminar
export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id); 
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado exitosamente" }); 
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cliente", error });
  }
};
