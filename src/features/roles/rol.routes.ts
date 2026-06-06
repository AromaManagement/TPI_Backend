import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "./rol.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateRoleSchema,
  UpdateRoleSchema,
  RoleParamsSchema,
} from "./rol.dto.js";

const router = Router();

// Proteger todas las rutas de roles con autenticación JWT
router.use(authenticateJWT);

router.post("/", validateBody(CreateRoleSchema), createRole);
router.get("/", getAllRoles);

router.get("/:roleId", validateParams(RoleParamsSchema), getRoleById);

router.put(
  "/:roleId",
  validateParams(RoleParamsSchema),
  validateBody(UpdateRoleSchema),
  updateRole,
);

router.delete("/:roleId", validateParams(RoleParamsSchema), deleteRole);

export default router;
