import { Router } from 'express';
import {
  createSeccion,
  getAllSecciones,
  getSeccionById,
  updateSeccion,
  deleteSeccion,
} from './secciones.controller.js';

const router = Router();

router.post('/', createSeccion);
router.get('/', getAllSecciones);
router.get('/:seccionId', getSeccionById);
router.put('/:seccionId', updateSeccion);
router.delete('/:seccionId', deleteSeccion);

export default router;  