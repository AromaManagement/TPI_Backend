import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUsersByRol,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
  updateMe,
} from "./usuario.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT, requireRole } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserParamsSchema,
} from "./usuario.dto.js";

const router = Router();

router.use(authenticateJWT);

router.get("/me", getMe);
router.put("/me", validateBody(UpdateUserSchema), updateMe);

router.post("/", requireRole("ADMIN"), validateBody(CreateUserSchema), createUser);
router.get("/", requireRole("ADMIN"), getAllUsers);
router.get("/by-rol", requireRole("ADMIN"), getUsersByRol);
router.get("/:userId", requireRole("ADMIN"), validateParams(UserParamsSchema), getUserById);
router.put("/:userId", requireRole("ADMIN"), validateParams(UserParamsSchema), validateBody(UpdateUserSchema), updateUser);
router.delete("/:userId", requireRole("ADMIN"), validateParams(UserParamsSchema), deleteUser);

export default router;
