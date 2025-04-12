// src/controllers/cliente.controller.ts
import { Request, Response } from 'express';

export const getClientes = (req: Request, res: Response) => {
  res.send('Lista de clientes');
};

export const getClienteById = (req: Request, res: Response) => {
  res.send(`Cliente con ID ${req.params.id}`);
};

export const createCliente = (req: Request, res: Response) => {
  res.send('Cliente creado');
};

export const updateCliente = (req: Request, res: Response) => {
  res.send(`Cliente actualizado con ID ${req.params.id}`);
};

export const deleteCliente = (req: Request, res: Response) => {
  res.send(`Cliente eliminado con ID ${req.params.id}`);
};
