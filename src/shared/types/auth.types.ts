import type { Request } from "express";
import { Rol } from "@prisma/client";

export interface UserTokenPayload {
  id: number;
  correo: string;
  rol: Rol;
}

export interface AuthenticatedRequest extends Request {
  user?: UserTokenPayload;
}
