import { Router } from "express";
import {
  createLocalidad,
  getAllLocalidades,
  getLocalidadById,
  updateLocalidad,
  deleteLocalidad,
} from "./localidad.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateLocalidadSchema,
  UpdateLocalidadSchema,
  LocalidadParamsSchema,
} from "./localidad.dto.js";

const router = Router();

// Proteger todas las rutas de localidades con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateLocalidadSchema), createLocalidad);
router.get("/", getAllLocalidades);

router.get(
  "/:localidadId",
  validateParams(LocalidadParamsSchema),
  getLocalidadById
);

router.put(
  "/:localidadId",
  validateParams(LocalidadParamsSchema),
  validateBody(UpdateLocalidadSchema),
  updateLocalidad
);

router.delete(
  "/:localidadId",
  validateParams(LocalidadParamsSchema),
  deleteLocalidad
);

export default router;
