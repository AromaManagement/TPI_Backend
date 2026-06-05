import { prisma } from "../../config/prisma.js";
import type { CreateRoleDto } from "./dto/create-role.dto.js";
import type { UpdateRoleDto } from "./dto/update-role.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const roleSelect = {
  id: true,
  nombre: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createRoleService = async (data: CreateRoleDto) => {
  const existingRole = await prisma.rol.findFirst({
    where: { nombre: data.nombre, deletedAt: null },
  });

  if (existingRole) {
    throw new ConflictError(`Ya existe un rol con el nombre '${data.nombre}'.`);
  }

  return await prisma.rol.create({
    data,
    select: roleSelect,
  });
};

export const getAllRolesService = async () => {
  return await prisma.rol.findMany({
    where: { deletedAt: null },
    select: roleSelect,
  });
};

export const getRoleByIdService = async (id: number) => {
  const role = await prisma.rol.findUnique({
    where: { id, deletedAt: null },
    select: roleSelect,
  });

  if (!role) {
    throw new NotFoundError(`El rol con ID ${id} no existe.`);
  }

  return role;
};

export const updateRoleService = async (id: number, data: UpdateRoleDto) => {
  const existingRole = await prisma.rol.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingRole) {
    throw new NotFoundError(`El rol con ID ${id} no existe.`);
  }

  if (data.nombre) {
    const duplicateRole = await prisma.rol.findFirst({
      where: { nombre: data.nombre, id: { not: id }, deletedAt: null },
    });
    if (duplicateRole) {
      throw new ConflictError(
        `Ya existe otro rol con el nombre '${data.nombre}'.`
      );
    }
  }

  return await prisma.rol.update({
    where: { id },
    data,
    select: roleSelect,
  });
};

export const deleteRoleService = async (id: number) => {
  const existingRole = await prisma.rol.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingRole) {
    throw new NotFoundError(
      `El rol con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay usuarios asociados a este rol
  const usersWithRoleCount = await prisma.usuario.count({
    where: { rolId: id, deletedAt: null },
  });

  if (usersWithRoleCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el rol porque tiene usuarios activos asociados."
    );
  }

  return await prisma.rol.delete({
    where: { id },
    select: roleSelect,
  });
};
