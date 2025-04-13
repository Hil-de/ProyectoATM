import { Request, Response } from 'express';
import Cliente from '../models/cliente'; // Importamos el modelo Cliente

// Obtener todos los clientes
export const getClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await Cliente.find(); // Buscar todos los clientes
    res.json(clientes); // Responder con la lista de clientes
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error });
  }
};

// Obtener un cliente por ID
export const getClienteById = async (req: Request, res: Response) => {
  try {
    const cliente = await Cliente.findById(req.params.id); // Buscar cliente por ID
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente); // Responder con el cliente encontrado
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error });
  }
};

// Crear un nuevo cliente
export const createCliente = async (req: Request, res: Response) => {
  try {
    const { nombre, documento, email, telefono } = req.body; // Obtener datos del cliente desde el body
    const nuevoCliente = new Cliente({ nombre, documento, email, telefono }); // Crear una nueva instancia de Cliente
    await nuevoCliente.save(); // Guardar en la base de datos
    res.status(201).json(nuevoCliente); // Responder con el cliente creado
  } catch (error) {
    res.status(500).json({ message: "Error al crear el cliente", error });
  }
};

// Actualizar un cliente por ID
export const updateCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Actualizar cliente
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json(cliente); // Responder con el cliente actualizado
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el cliente", error });
  }
};

// Eliminar un cliente por ID
export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id); // Eliminar cliente
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado exitosamente" }); // Responder con mensaje de éxito
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cliente", error });
  }
};
