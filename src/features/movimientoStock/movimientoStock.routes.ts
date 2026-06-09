import { Router } from "express";
import { createMovimiento, getAllMovimientoStock, getMovimientoStockById } from "./movimientoStock.controller.js";
import { validateBody, validateParams } from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import { CreateMovimientoStockSchema } from "./movimientoStock.dto.js";

const router = Router();

router.use(authenticateJWT);

router.post("/", validateBody(CreateMovimientoStockSchema), createMovimiento);
router.get("/", getAllMovimientoStock);
router.get("/:movimientoId", validateParams(CreateMovimientoStockSchema), getMovimientoStockById);

export default router;