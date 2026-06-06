import { Router } from "express";
import {
  createEstadoRecorrido,
  getAllEstadoRecorridos,
  getEstadoRecorridoById,
  updateEstadoRecorrido,
  deleteEstadoRecorrido,
} from "./estado-recorrido.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateEstadoRecorridoSchema,
  UpdateEstadoRecorridoSchema,
  EstadoRecorridoParamsSchema,
} from "./estado-recorrido.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateEstadoRecorridoSchema), createEstadoRecorrido);
router.get("/", getAllEstadoRecorridos);

router.get(
  "/:estadoRecorridoId",
  validateParams(EstadoRecorridoParamsSchema),
  getEstadoRecorridoById
);

router.put(
  "/:estadoRecorridoId",
  validateParams(EstadoRecorridoParamsSchema),
  validateBody(UpdateEstadoRecorridoSchema),
  updateEstadoRecorrido
);

router.delete(
  "/:estadoRecorridoId",
  validateParams(EstadoRecorridoParamsSchema),
  deleteEstadoRecorrido
);

export default router;
