import { prisma } from "../../config/prisma.js";
import type { LoginDto, RegisterDto } from "./auth.dto.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors/app-error.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret_key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export const loginService = async (data: LoginDto) => {
  const user = await prisma.usuario.findUnique({
    where: { correo: data.correo, deletedAt: null },
  });

  if (!user) {
    throw new UnauthorizedError("Correo o contraseña incorrectos.");
  }

  const isPasswordValid = await bcrypt.compare(
    data.contrasena,
    user.contrasena
  );

  if (!isPasswordValid) {
    throw new UnauthorizedError("Correo o contraseña incorrectos.");
  }

  const token = jwt.sign(
    { id: user.id, correo: user.correo, rol: user.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  const { contrasena, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    token,
  };
};

export const registerService = async (data: RegisterDto) => {
  // Verificar si el correo ya existe
  const existingUser = await prisma.usuario.findUnique({
    where: { correo: data.correo, deletedAt: null },
  });

  if (existingUser) {
    throw new ConflictError("El correo ya está registrado.");
  }

  // Validar existencia de la dirección si se provee
  if (data.direccionId) {
    const direccionExists = await prisma.direccion.findUnique({
      where: { id: data.direccionId, deletedAt: null },
    });
    if (!direccionExists) {
      throw new NotFoundError(
        `La dirección con ID ${data.direccionId} no existe.`
      );
    }
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  const result = await prisma.usuario.create({
    data: {
      ...data,
      contrasena: hashedPassword,
    },
  });

  const token = jwt.sign(
    { id: result.id, correo: result.correo, rol: result.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
  );

  const { contrasena, ...userWithoutPassword } = result;

  return {
    user: userWithoutPassword,
    token,
  };
};
