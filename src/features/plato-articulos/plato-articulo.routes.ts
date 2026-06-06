import { Router } from "express";
import {
  createPlatoArticulo,
  getAllPlatoArticulos,
  getPlatoArticuloByIds,
  updatePlatoArticulo,
  deletePlatoArticulo,
} from "./plato-articulo.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreatePlatoArticuloSchema,
  UpdatePlatoArticuloSchema,
  PlatoArticuloParamsSchema,
} from "./plato-articulo.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreatePlatoArticuloSchema), createPlatoArticulo);
router.get("/", getAllPlatoArticulos);

router.get(
  "/:platoId/:articuloId",
  validateParams(PlatoArticuloParamsSchema),
  getPlatoArticuloByIds
);

router.put(
  "/:platoId/:articuloId",
  validateParams(PlatoArticuloParamsSchema),
  validateBody(UpdatePlatoArticuloSchema),
  updatePlatoArticulo
);

router.delete(
  "/:platoId/:articuloId",
  validateParams(PlatoArticuloParamsSchema),
  deletePlatoArticulo
);

export default router;
