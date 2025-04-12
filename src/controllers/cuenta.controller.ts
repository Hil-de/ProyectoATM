import { Request, Response } from 'express';

export const getCuentas = (req: Request, res: Response) => {
    res.send('Obtener todas las cuentas');
};

export const getCuentaById = (req: Request, res: Response) => {
    res.send(`Obtener cuenta ${req.params.id}`);
};

export const createCuenta = (req: Request, res: Response) => {
    res.send('Crear nueva cuenta');
};

export const updateCuenta = (req: Request, res: Response) => {
    res.send(`Actualizar cuenta ${req.params.id}`);
};
    
export const deleteCuenta = (req: Request, res: Response) => {
    res.send(`Eliminar cuenta ${req.params.id}`);
};
