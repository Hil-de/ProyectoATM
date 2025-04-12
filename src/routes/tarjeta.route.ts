import { Router } from 'express';
import {
  getTarjetas, getTarjetaById, createTarjeta, updateTarjeta, deleteTarjeta
} from '../controllers/tarjeta.controller';

const router = Router();

router.get('/', getTarjetas);
router.get('/:id', getTarjetaById);
router.post('/', createTarjeta);
router.put('/:id', updateTarjeta);
router.delete('/:id', deleteTarjeta);

export default router;
