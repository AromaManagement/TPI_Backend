import { Router } from "express";
import {
  createImagen,
  getAllImagenes,
  getImagenById,
  updateImagen,
  deleteImagen,
} from "./imagen.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT, requireRole } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateImagenSchema,
  UpdateImagenSchema,
  ImagenParamsSchema,
} from "./imagen.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.get("/", getAllImagenes);
router.get("/:imagenId", validateParams(ImagenParamsSchema), getImagenById);

router.post("/", requireRole("ADMIN"), validateBody(CreateImagenSchema), createImagen);
router.put("/:imagenId", requireRole("ADMIN"), validateParams(ImagenParamsSchema), validateBody(UpdateImagenSchema), updateImagen);
router.delete("/:imagenId", requireRole("ADMIN"), validateParams(ImagenParamsSchema), deleteImagen);

export default router;
