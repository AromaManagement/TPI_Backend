import { Router } from "express";
import { login, register } from "./auth.controller.js";
import { validateBody } from "../../shared/middlewares/validation.middleware.js";
import { LoginSchema, RegisterSchema } from "./auth.dto.js";

const router = Router();

router.post("/login", validateBody(LoginSchema), login);
router.post("/register", validateBody(RegisterSchema), register);

export default router;
