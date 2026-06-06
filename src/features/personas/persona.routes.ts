import { Router } from "express";
import {
  createPersona,
  getAllPersonas,
  getPersonaById,
  updatePersona,
  deletePersona,
} from "./persona.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreatePersonaSchema,
  UpdatePersonaSchema,
  PersonaParamsSchema,
} from "./persona.dto.js";

const router = Router();

// Proteger todas las rutas de personas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreatePersonaSchema), createPersona);
router.get("/", getAllPersonas);

router.get("/:personaId", validateParams(PersonaParamsSchema), getPersonaById);

router.put(
  "/:personaId",
  validateParams(PersonaParamsSchema),
  validateBody(UpdatePersonaSchema),
  updatePersona
);

router.delete(
  "/:personaId",
  validateParams(PersonaParamsSchema),
  deletePersona
);

export default router;
