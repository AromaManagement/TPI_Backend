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
import { CreateUserSchema } from "./dto/create-user.dto.js";
import { UpdateUserSchema } from "./dto/update-user.dto.js";
import { UserParamsSchema } from "./dto/user-params.dto.js";

const router = Router();

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
