import { Router } from "express";
import {
  createDireccion,
  getAllDirecciones,
  getDireccionById,
  updateDireccion,
  deleteDireccion,
} from "./direccion.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateDireccionSchema,
  UpdateDireccionSchema,
  DireccionParamsSchema,
} from "./direccion.dto.js";

const router = Router();

// Proteger todas las rutas de direcciones con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateDireccionSchema), createDireccion);
router.get("/", getAllDirecciones);

router.get(
  "/:direccionId",
  validateParams(DireccionParamsSchema),
  getDireccionById
);

router.put(
  "/:direccionId",
  validateParams(DireccionParamsSchema),
  validateBody(UpdateDireccionSchema),
  updateDireccion
);

router.delete(
  "/:direccionId",
  validateParams(DireccionParamsSchema),
  deleteDireccion
);

export default router;
