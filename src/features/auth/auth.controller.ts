import type { Request, Response } from "express";
import { loginService, registerService } from "./auth.services.js";

export const login = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await loginService(data);

  res.status(200).json({
    status: "success",
    message: "Inicio de sesión exitoso.",
    data: result,
  });
};

export const register = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await registerService(data);

  res.status(201).json({
    status: "success",
    message: "Usuario registrado exitosamente.",
    data: result,
  });
};
