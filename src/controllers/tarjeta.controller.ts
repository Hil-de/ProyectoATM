import { Request, Response } from 'express';

export const getTarjetas = (req: Request, res: Response) => {
    res.send('Obtener todas las tarjetas');
};

export const getTarjetaById = (req: Request, res: Response) => {
    res.send(`Obtener tarjeta ${req.params.id}`);
};

export const createTarjeta = (req: Request, res: Response) => {
    res.send('Crear nueva tarjeta');
};

export const updateTarjeta = (req: Request, res: Response) => {
    res.send(`Actualizar tarjeta ${req.params.id}`);
};

export const deleteTarjeta = (req: Request, res: Response) => {
    res.send(`Eliminar tarjeta ${req.params.id}`);
};
