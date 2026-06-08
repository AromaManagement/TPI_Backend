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
import { authenticateJWT, requireRole } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateLocalidadSchema,
  UpdateLocalidadSchema,
  LocalidadParamsSchema,
} from "./localidad.dto.js";

const router = Router();

// Proteger todas las rutas de localidades con autenticación JWT
router.use(authenticateJWT);

router.get("/", getAllLocalidades);
router.get("/:localidadId", validateParams(LocalidadParamsSchema), getLocalidadById);

router.post("/", requireRole("ADMIN"), validateBody(CreateLocalidadSchema), createLocalidad);
router.put("/:localidadId", requireRole("ADMIN"), validateParams(LocalidadParamsSchema), validateBody(UpdateLocalidadSchema), updateLocalidad);
router.delete("/:localidadId", requireRole("ADMIN"), validateParams(LocalidadParamsSchema), deleteLocalidad);

export default router;
