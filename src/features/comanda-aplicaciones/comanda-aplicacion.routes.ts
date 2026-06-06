import { Router } from "express";
import {
  createComandaAplicacion,
  getAllComandaAplicaciones,
  getComandaAplicacionById,
  updateComandaAplicacion,
  deleteComandaAplicacion,
} from "./comanda-aplicacion.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateComandaAplicacionSchema,
  UpdateComandaAplicacionSchema,
  ComandaAplicacionParamsSchema,
} from "./comanda-aplicacion.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post(
  "/",
  validateBody(CreateComandaAplicacionSchema),
  createComandaAplicacion
);
router.get("/", getAllComandaAplicaciones);

router.get(
  "/:comandaAplicacionId",
  validateParams(ComandaAplicacionParamsSchema),
  getComandaAplicacionById
);

router.put(
  "/:comandaAplicacionId",
  validateParams(ComandaAplicacionParamsSchema),
  validateBody(UpdateComandaAplicacionSchema),
  updateComandaAplicacion
);

router.delete(
  "/:comandaAplicacionId",
  validateParams(ComandaAplicacionParamsSchema),
  deleteComandaAplicacion
);

export default router;
