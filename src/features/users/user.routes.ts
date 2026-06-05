import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import {
  validateBody,
  validateParams,
} from "../../shared/middlewares/validation.middleware.js";
import { authenticateJWT } from "../../shared/middlewares/auth.middleware.js";
import {
  CreateUserSchema,
  UpdateUserSchema,
  UserParamsSchema,
} from "./user.dto.js";

const router = Router();

router.use(authenticateJWT);

router.post("/", validateBody(CreateUserSchema), createUser);
router.get("/", getAllUsers);

router.get(
  "/:userId", 
  validateParams(UserParamsSchema), 
  getUserById
);

router.put(
  "/:userId", 
  validateParams(UserParamsSchema), 
  validateBody(UpdateUserSchema), 
  updateUser
);

router.delete(
  "/:userId", 
  validateParams(UserParamsSchema), 
  deleteUser
);

export default router;
