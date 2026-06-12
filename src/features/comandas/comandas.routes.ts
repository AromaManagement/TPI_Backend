import { Router } from "express";
import {
  createComanda,
  getActiveComandaByClienteId,
  getHistorialCliente,
  getCommandasByEstado,
  assignRepartidorToComanda,
  assignChefToComandaDetalle,
  completarDetalle,
  desasignarDetalle,
  updateComandaEstado,
  cancelarComanda,
} from "./comandas.controller.js";

import { authenticateJWT, requireRole } from "../../shared/middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateJWT);

router.post("/", requireRole("CLIENTE"), createComanda);
router.get("/active", requireRole("CLIENTE"), getActiveComandaByClienteId);
router.get("/historial", requireRole("CLIENTE"), getHistorialCliente);
router.get("/estado/:estado", requireRole("ADMIN", "COCINERO", "REPARTIDOR"), getCommandasByEstado);
router.post("/assign-repartidor", requireRole("REPARTIDOR"), assignRepartidorToComanda);
router.post("/assign-chef", requireRole("COCINERO", "ADMIN"), assignChefToComandaDetalle);
router.patch("/detalles/:id/completar", requireRole("COCINERO", "ADMIN"), completarDetalle);
router.patch("/detalles/:id/desasignar", requireRole("COCINERO", "ADMIN"), desasignarDetalle);
router.patch("/:id/estado", requireRole("ADMIN", "COCINERO", "REPARTIDOR"), updateComandaEstado);
router.post("/:id/cancelar", requireRole("CLIENTE"), cancelarComanda);

export default router;
