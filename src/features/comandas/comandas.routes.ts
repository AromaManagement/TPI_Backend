import { Router } from "express";
import {
  createComanda,
    getAllComandas,
    getComandaById,
    updateComanda,
    deleteComanda,
} from "./comandas.controller.js";
import {
  validateBody,
    validateParams,
    } from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
    CreateComandaSchema,
        UpdateComandaSchema,
        ComandaParamsSchema,
    } from "./comanda.dto.js";

const router = Router();

router.use(authenticateJWT);

router.post("/", validateBody(CreateComandaSchema), createComanda);
router.get("/", getAllComandas);

router.get("/:comandaId", validateParams(ComandaParamsSchema), getComandaById);

router.put(
    "/:comandaId",
    validateParams(ComandaParamsSchema),
    validateBody(UpdateComandaSchema),
    updateComanda
);

router.delete("/:comandaId", validateParams(ComandaParamsSchema), deleteComanda);

export default router;