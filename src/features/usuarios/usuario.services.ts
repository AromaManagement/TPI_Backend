import { prisma } from "../../config/prisma.js";
import type { CreateUserDto, UpdateUserDto } from "./usuario.dto.js";
import { ConflictError, NotFoundError } from "../../shared/errors/app-error.js";
import bcrypt from "bcrypt";

const userSelect = {
  id: true,
  correo: true,
  nombre: true,
  apellido: true,
  tipoDocumento: true,
  documento: true,
  nacimiento: true,
  direccionId: true,
  rol: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createUserService = async (data: CreateUserDto) => {
  const existing = await prisma.usuario.findUnique({
    where: { correo: data.correo },
  });

  if (existing) {
    throw new ConflictError("El correo ya está registrado.");
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  return prisma.usuario.create({
    data: { ...data, contrasena: hashedPassword },
    select: userSelect,
  });
};

export const getAllUsersService = async () => {
  return prisma.usuario.findMany({
    where: { deletedAt: null },
    select: userSelect,
    orderBy: { createdAt: "asc" },
  });
};

export const getUserByIdService = async (id: number) => {
  const user = await prisma.usuario.findUnique({
    where: { id, deletedAt: null },
    select: userSelect,
  });

  if (!user) {
    throw new NotFoundError(`El usuario con ID ${id} no existe.`);
  }

  return user;
};

export const updateUserService = async (id: number, data: UpdateUserDto) => {
  const existing = await prisma.usuario.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(`El usuario con ID ${id} no existe.`);
  }

  const updateData: typeof data & { contrasena?: string } = { ...data };

  if (updateData.contrasena) {
    updateData.contrasena = await bcrypt.hash(updateData.contrasena, 10);
  }

  return prisma.usuario.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });
};

export const deleteUserService = async (id: number) => {
  const existing = await prisma.usuario.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(`El usuario con ID ${id} no existe.`);
  }

  return prisma.usuario.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: userSelect,
  });
};
