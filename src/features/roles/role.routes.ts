import { Router } from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "./role.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import { CreateRoleSchema } from "./dto/create-role.dto.js";
import { UpdateRoleSchema } from "./dto/update-role.dto.js";
import { RoleParamsSchema } from "./dto/role-params.dto.js";

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
  updateRole
);

router.delete("/:roleId", validateParams(RoleParamsSchema), deleteRole);

export default router;
