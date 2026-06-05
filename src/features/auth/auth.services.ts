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
    { id: user.id, correo: user.correo, rolId: user.rolId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
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

  // Usar una transacción para crear la persona y el usuario de manera atómica
  const result = await prisma.$transaction(async (tx) => {
    let rolId = data.rolId;
    if (!rolId) {
      let defaultRole = await tx.rol.findFirst({
        where: { nombre: "Cliente", deletedAt: null },
      });
      if (!defaultRole) {
        defaultRole = await tx.rol.create({
          data: { nombre: "Cliente" },
        });
      }
      rolId = defaultRole.id;
    } else {
      // Validar que el rol exista
      const roleExists = await tx.rol.findUnique({
        where: { id: rolId, deletedAt: null },
      });
      if (!roleExists) {
        throw new NotFoundError(`El rol con ID ${rolId} no existe.`);
      }
    }

    let personaId = data.personaId;
    if (!personaId) {
      const newPersona = await tx.persona.create({
        data: {
          nombre: data.nombre!,
          apellido: data.apellido!,
        },
      });
      personaId = newPersona.id;
    } else {
      const personaExists = await tx.persona.findUnique({
        where: { id: personaId, deletedAt: null },
      });
      if (!personaExists) {
        throw new NotFoundError(`La persona con ID ${personaId} no existe.`);
      }
    }

    const hashedPassword = await bcrypt.hash(data.contrasena, 10);

    const newUser = await tx.usuario.create({
      data: {
        correo: data.correo,
        contrasena: hashedPassword,
        rolId,
        personaId,
      },
    });

    return newUser;
  });

  const token = jwt.sign(
    { id: result.id, correo: result.correo, rolId: result.rolId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );

  const { contrasena, ...userWithoutPassword } = result;

  return {
    user: userWithoutPassword,
    token,
  };
};
