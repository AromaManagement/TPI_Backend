import { Router } from "express";
import {
  createComanda,
  getActiveComandaByClienteId,
  getCommandasByEstado,
  assignRepartidorToComanda,
  assignChefToComandaDetalle,
} from "./comandas.controller.js";

import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateJWT);

router.post("/",  createComanda);
router.get("/active", getActiveComandaByClienteId);
router.get("/estado/:estado", getCommandasByEstado);
router.post("/assign-repartidor", assignRepartidorToComanda);
router.post("/assign-chef", assignChefToComandaDetalle);


export default router;