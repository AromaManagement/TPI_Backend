import { Router } from "express";
import {
  createArticulo,
  getAllArticulos,
  getArticuloById,
  updateArticulo,
  deleteArticulo,
} from "./articulo.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateArticuloSchema,
  UpdateArticuloSchema,
  ArticuloParamsSchema,
} from "./articulo.dto.js";

const router = Router();

router.use(authenticateJWT);

router.post("/" ,validateBody(CreateArticuloSchema), createArticulo);
router.get("/", getAllArticulos);

router.get("/:articuloId", validateParams(ArticuloParamsSchema), getArticuloById);

router.put(
  "/:articuloId",
  validateParams(ArticuloParamsSchema),
  validateBody(UpdateArticuloSchema),
  updateArticulo,
);

router.delete(
  "/:articuloId",
  validateParams(ArticuloParamsSchema),
  deleteArticulo,
);

export default router;