import { Router } from "express";
import {
  createEmpleado,
  getAllEmpleados,
  getEmpleadoById,
  updateEmpleado,
  deleteEmpleado,
} from "./empleado.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateEmpleadoSchema,
  UpdateEmpleadoSchema,
  EmpleadoParamsSchema,
} from "./empleado.dto.js";

const router = Router();

// Proteger todas las rutas con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateEmpleadoSchema), createEmpleado);
router.get("/", getAllEmpleados);

router.get(
  "/:empleadoId",
  validateParams(EmpleadoParamsSchema),
  getEmpleadoById
);

router.put(
  "/:empleadoId",
  validateParams(EmpleadoParamsSchema),
  validateBody(UpdateEmpleadoSchema),
  updateEmpleado
);

router.delete(
  "/:empleadoId",
  validateParams(EmpleadoParamsSchema),
  deleteEmpleado
);

export default router;
