import { Router } from "express";
import {
  createCliente,
  getAllClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
} from "./cliente.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateClienteSchema,
  UpdateClienteSchema,
  ClienteParamsSchema,
} from "./cliente.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateClienteSchema), createCliente);
router.get("/", getAllClientes);

router.get("/:clienteId", validateParams(ClienteParamsSchema), getClienteById);

router.put(
  "/:clienteId",
  validateParams(ClienteParamsSchema),
  validateBody(UpdateClienteSchema),
  updateCliente
);

router.delete(
  "/:clienteId",
  validateParams(ClienteParamsSchema),
  deleteCliente
);

export default router;
