import type { Request } from "express";

export interface UserTokenPayload {
  id: number;
  correo: string;
  rolId: number;
}

export interface AuthenticatedRequest extends Request {
  user?: UserTokenPayload;
}
