import { Router } from 'express';
import {
  getCuentas, getCuentaById, createCuenta, updateCuenta, deleteCuenta
} from '../controllers/cuenta.controller';

const router = Router();

router.get('/', getCuentas);
router.get('/:id', getCuentaById);
router.post('/', createCuenta);
router.put('/:id', updateCuenta);
router.delete('/:id', deleteCuenta);

export default router;
