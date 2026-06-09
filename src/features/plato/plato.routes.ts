import { Router } from "express";
import { createPlato, getAllPlatos, getPlatoById, updatePlato, deletePlato } from "./plato.controller.js";
import { validateBody, validateParams } from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import { CreatePlatoSchema, PlatosParamsSchema, UpdatePlatoSchema } from "./plato.dto.js";

const router = Router();

router.use(authenticateJWT);

router.post("/", validateBody(CreatePlatoSchema), createPlato);
router.get("/", getAllPlatos);
router.get("/:platoId", validateParams(PlatosParamsSchema), getPlatoById);
router.put("/:platoId", validateParams(PlatosParamsSchema), validateBody(UpdatePlatoSchema), updatePlato);
router.delete("/:platoId", validateParams(PlatosParamsSchema), deletePlato);

export default router;