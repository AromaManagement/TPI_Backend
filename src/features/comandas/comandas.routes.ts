import { Router } from "express";
import {
  createComanda,
  getActiveComandaByClienteId,
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

router.post("/",  createComanda);
router.get("/active", getActiveComandaByClienteId);


export default router;