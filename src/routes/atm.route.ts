import { Router } from 'express';
import {
  getATMs, getATMById, createATM, updateATM, deleteATM
} from '../controllers/atm.controller';

const router = Router();

router.get('/', getATMs);
router.get('/:id', getATMById);
router.post('/', createATM);
router.put('/:id', updateATM);
router.delete('/:id', deleteATM);

export default router;
