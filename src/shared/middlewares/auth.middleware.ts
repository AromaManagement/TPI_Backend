import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/app-error.js";
import type { AuthenticatedRequest, UserTokenPayload } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret_key";

export const authenticateJWT = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(
      new UnauthorizedError(
        "Acceso denegado. No se proporcionó un token de autenticación."
      )
    );
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next(
      new UnauthorizedError(
        "Formato de token de autenticación inválido. Debe usar el formato 'Bearer <token>'."
      )
    );
  }

  const token = parts[1];

  if (!token) {
    return next(
      new UnauthorizedError(
        "Acceso denegado. No se proporcionó un token de autenticación."
      )
    );
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserTokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new UnauthorizedError("Token de autenticación inválido o expirado.")
    );
  }
};
