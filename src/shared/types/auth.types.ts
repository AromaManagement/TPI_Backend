import type { Request } from "express";

export type Rol = "ADMIN" | "CLIENTE" | "COCINERO" | "REPARTIDOR";

export interface UserTokenPayload {
  id: number;
  correo: string;
  rol: Rol;
}

export interface AuthenticatedRequest extends Request {
  user?: UserTokenPayload;
}
