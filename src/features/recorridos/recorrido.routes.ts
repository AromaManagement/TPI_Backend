import { Router } from "express";
import {
  createRecorrido,
  getAllRecorridos,
  getRecorridoById,
  updateRecorrido,
  deleteRecorrido,
} from "./recorrido.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateRecorridoSchema,
  UpdateRecorridoSchema,
  RecorridoParamsSchema,
} from "./recorrido.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateRecorridoSchema), createRecorrido);
router.get("/", getAllRecorridos);

router.get(
  "/:recorridoId",
  validateParams(RecorridoParamsSchema),
  getRecorridoById
);

router.put(
  "/:recorridoId",
  validateParams(RecorridoParamsSchema),
  validateBody(UpdateRecorridoSchema),
  updateRecorrido
);

router.delete(
  "/:recorridoId",
  validateParams(RecorridoParamsSchema),
  deleteRecorrido
);

export default router;
