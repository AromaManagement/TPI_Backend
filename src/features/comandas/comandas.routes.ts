import { Router } from "express";
import {
  createComanda,
  getActiveComandaByClienteId,
  getCommandasByEstado,
  assignRepartidorToComanda,
  assignChefToComandaDetalle,
  updateComandaEstado,
} from "./comandas.controller.js";

import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateJWT);

router.post("/",  createComanda);
router.get("/active", getActiveComandaByClienteId);
router.get("/estado/:estado", getCommandasByEstado);
router.post("/assign-repartidor", assignRepartidorToComanda);
router.post("/assign-chef", assignChefToComandaDetalle);
router.patch("/:id/estado", updateComandaEstado);


export default router;