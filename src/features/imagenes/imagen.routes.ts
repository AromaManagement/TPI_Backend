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
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateImagenSchema,
  UpdateImagenSchema,
  ImagenParamsSchema,
} from "./imagen.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateImagenSchema), createImagen);
router.get("/", getAllImagenes);

router.get("/:imagenId", validateParams(ImagenParamsSchema), getImagenById);

router.put(
  "/:imagenId",
  validateParams(ImagenParamsSchema),
  validateBody(UpdateImagenSchema),
  updateImagen
);

router.delete("/:imagenId", validateParams(ImagenParamsSchema), deleteImagen);

export default router;
