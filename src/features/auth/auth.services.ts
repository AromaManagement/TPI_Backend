import { prisma } from "../../config/prisma.js";
import type { LoginDto, RegisterDto } from "./auth.dto.js";
import {
  ConflictError,
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

  const isPasswordValid = await bcrypt.compare(data.contrasena, user.contrasena);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Correo o contraseña incorrectos.");
  }

  const token = jwt.sign(
    { id: user.id, correo: user.correo, rol: user.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  const { contrasena, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const registerService = async (data: RegisterDto) => {
  const existingUser = await prisma.usuario.findUnique({
    where: { correo: data.correo },
  });

  if (existingUser) {
    throw new ConflictError("El correo ya está registrado.");
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  const newUser = await prisma.usuario.create({
    data: {
      correo: data.correo,
      contrasena: hashedPassword,
      nombre: data.nombre,
      apellido: data.apellido,
      rol: "CLIENTE",
    },
  });

  const token = jwt.sign(
    { id: newUser.id, correo: newUser.correo, rol: newUser.rol },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  const { contrasena, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, token };
};
