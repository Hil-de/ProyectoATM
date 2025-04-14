import { Router } from 'express';
import { validarTarjeta } from '../controllers/atm.controller';

const router = Router();

// Ruta para validar tarjeta y PIN
router.post('/validar', validarTarjeta);

export default router; 