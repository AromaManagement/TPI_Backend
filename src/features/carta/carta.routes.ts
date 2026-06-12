import { Router } from 'express';
import {
  createCarta,
  getAllCarta,
  getCartaById,
  updateCarta,
  deleteCarta,
  getCartaDisponibles,
  getCartaAdmin,
} from './carta.controller.js';

const router = Router();

router.post('/', createCarta);
router.get('/', getAllCarta);
router.get('/disponibles', getCartaDisponibles);
router.get('/admin', getCartaAdmin);
router.get('/:cartaId', getCartaById);
router.put('/:cartaId', updateCarta);
router.delete('/:cartaId', deleteCarta);


export default router;