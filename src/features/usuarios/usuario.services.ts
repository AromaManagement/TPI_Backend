import { prisma } from "../../config/prisma.js";
import type { CreateUserDto, UpdateUserDto } from "./usuario.dto.js";
import { NotFoundError } from "../../shared/errors/app-error.js";
import bcrypt from "bcrypt";

const userSelect = {
  id: true,
  correo: true,
  rolId: true,
  personaId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createUserService = async (data: CreateUserDto) => {
  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  const newUser = await prisma.usuario.create({
    data: {
      ...data,
      contrasena: hashedPassword,
    },
  });

  return newUser;
};

export const getAllUsersService = async () => {
  return await prisma.usuario.findMany({
    select: userSelect,
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
  const existingUser = await prisma.usuario.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingUser) {
    throw new NotFoundError(`El usuario con ID ${id} no existe.`);
  }

  const updateData = { ...data };

  if (updateData.contrasena) {
    updateData.contrasena = await bcrypt.hash(updateData.contrasena, 10);
  }

  const updatedUser = await prisma.usuario.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });

  return updatedUser;
};

export const deleteUserService = async (id: number) => {
  const existingUser = await prisma.usuario.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingUser) {
    throw new NotFoundError(
      `El usuario con ID ${id} no existe y no se puede eliminar.`,
    );
  }

  return await prisma.usuario.delete({
    where: { id },
    select: userSelect,
  });
};
