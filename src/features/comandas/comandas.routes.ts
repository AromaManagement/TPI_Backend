import { Router } from "express";
import {
  createComanda,
  getActiveComandaByClienteId,
  getCommandasByEstado,
  assignRepartidorToComanda,
  assignChefToComandaDetalle,
  completarDetalle,
  updateComandaEstado,
} from "./comandas.controller.js";

import { authenticateJWT, requireRole } from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateJWT);

router.post("/", requireRole("CLIENTE"), createComanda);
router.get("/active", requireRole("CLIENTE"), getActiveComandaByClienteId);
router.get("/estado/:estado", requireRole("ADMIN", "COCINERO", "REPARTIDOR"), getCommandasByEstado);
router.post("/assign-repartidor", requireRole("REPARTIDOR"), assignRepartidorToComanda);
router.post("/assign-chef", requireRole("COCINERO"), assignChefToComandaDetalle);
router.patch("/detalles/:id/completar", requireRole("COCINERO"), completarDetalle);
router.patch("/:id/estado", requireRole("ADMIN", "COCINERO", "REPARTIDOR"), updateComandaEstado);

export default router;
