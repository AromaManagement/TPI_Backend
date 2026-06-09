import { Router } from "express";
import {
    createStock,
    getAllStocks,
    getStockById,
    updateStock,
    deleteStock
} from "./stock.controller.js";
import {
    validateBody,
    validateParams
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
    CreateStockSchema,
    UpdateStockSchema,
    StockParamsSchema
} from "./stock.dto.js";

const router = Router();

router.use(authenticateJWT);

router.post("/", validateBody(CreateStockSchema), createStock);
router.get("/", getAllStocks);

router.get("/:stockId", validateParams(StockParamsSchema), getStockById);

router.put(
    "/:stockId",
    validateParams(StockParamsSchema),
    validateBody(UpdateStockSchema),
    updateStock,
);

router.delete(
    "/:stockId",
    validateParams(StockParamsSchema),
    deleteStock,
);

export default router;  