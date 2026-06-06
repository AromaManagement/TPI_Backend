import { Router } from "express";
import {
  createPlato,
  getAllPlatos,
  getPlatoById,
  updatePlato,
  deletePlato,
} from "./plato.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreatePlatoSchema,
  UpdatePlatoSchema,
  PlatoParamsSchema,
} from "./plato.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreatePlatoSchema), createPlato);
router.get("/", getAllPlatos);

router.get("/:platoId", validateParams(PlatoParamsSchema), getPlatoById);

router.put(
  "/:platoId",
  validateParams(PlatoParamsSchema),
  validateBody(UpdatePlatoSchema),
  updatePlato
);

router.delete("/:platoId", validateParams(PlatoParamsSchema), deletePlato);

export default router;
