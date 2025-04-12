import { Request, Response } from 'express';

export const getATMs = (req: Request, res: Response) => {
    res.send('Obtener todos los cajeros');
};

export const getATMById = (req: Request, res: Response) => {
    res.send(`Obtener cajero ${req.params.id}`);
};

export const createATM = (req: Request, res: Response) => {
    res.send('Crear nuevo cajero');
};

export const updateATM = (req: Request, res: Response) => {
    res.send(`Actualizar cajero ${req.params.id}`);
};

export const deleteATM = (req: Request, res: Response) => {
    res.send(`Eliminar cajero ${req.params.id}`);
};
