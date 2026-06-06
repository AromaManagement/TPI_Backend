import { Router } from "express";
import {
  createCarta,
  getAllCartas,
  getCartaById,
  updateCarta,
  deleteCarta,
} from "./carta.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateCartaSchema,
  UpdateCartaSchema,
  CartaParamsSchema,
} from "./carta.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateCartaSchema), createCarta);
router.get("/", getAllCartas);

router.get("/:cartaId", validateParams(CartaParamsSchema), getCartaById);

router.put(
  "/:cartaId",
  validateParams(CartaParamsSchema),
  validateBody(UpdateCartaSchema),
  updateCarta
);

router.delete("/:cartaId", validateParams(CartaParamsSchema), deleteCarta);

export default router;
