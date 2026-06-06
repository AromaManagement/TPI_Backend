import { Router } from "express";
import {
  createSeccion,
  getAllSecciones,
  getSeccionById,
  updateSeccion,
  deleteSeccion,
} from "./seccion.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateSeccionSchema,
  UpdateSeccionSchema,
  SeccionParamsSchema,
} from "./seccion.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateSeccionSchema), createSeccion);
router.get("/", getAllSecciones);

router.get(
  "/:seccionId",
  validateParams(SeccionParamsSchema),
  getSeccionById
);

router.put(
  "/:seccionId",
  validateParams(SeccionParamsSchema),
  validateBody(UpdateSeccionSchema),
  updateSeccion
);

router.delete(
  "/:seccionId",
  validateParams(SeccionParamsSchema),
  deleteSeccion
);

export default router;
