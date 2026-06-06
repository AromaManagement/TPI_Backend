import { Router } from "express";
import {
  createTipoEmpleado,
  getAllTipoEmpleados,
  getTipoEmpleadoById,
  updateTipoEmpleado,
  deleteTipoEmpleado,
} from "./tipo-empleado.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateTipoEmpleadoSchema,
  UpdateTipoEmpleadoSchema,
  TipoEmpleadoParamsSchema,
} from "./tipo-empleado.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateTipoEmpleadoSchema), createTipoEmpleado);
router.get("/", getAllTipoEmpleados);

router.get(
  "/:tipoEmpleadoId",
  validateParams(TipoEmpleadoParamsSchema),
  getTipoEmpleadoById
);

router.put(
  "/:tipoEmpleadoId",
  validateParams(TipoEmpleadoParamsSchema),
  validateBody(UpdateTipoEmpleadoSchema),
  updateTipoEmpleado
);

router.delete(
  "/:tipoEmpleadoId",
  validateParams(TipoEmpleadoParamsSchema),
  deleteTipoEmpleado
);

export default router;
