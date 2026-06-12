import { prisma } from "../../config/prisma.js";
import type { CreateDireccionDto, UpdateDireccionDto } from "./direccion.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const direccionSelect = {
  id: true,
  barrio: true,
  calle: true,
  manzanaPiso: true,
  numeracion: true,
  referencia: true,
  casaDepto: true,
  lat: true,
  lng: true,
  etiqueta: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createDireccionService = async (data: CreateDireccionDto) => {
  return await prisma.direccion.create({
    data,
    select: direccionSelect,
  });
};

export const getAllDireccionesService = async () => {
  return await prisma.direccion.findMany({
    where: { deletedAt: null },
    select: direccionSelect,
  });
};

export const getDireccionByIdService = async (id: number) => {
  const direccion = await prisma.direccion.findUnique({
    where: { id, deletedAt: null },
    select: direccionSelect,
  });

  if (!direccion) {
    throw new NotFoundError(`La dirección con ID ${id} no existe.`);
  }

  return direccion;
};

export const updateDireccionService = async (
  id: number,
  data: UpdateDireccionDto
) => {
  const existingDireccion = await prisma.direccion.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingDireccion) {
    throw new NotFoundError(`La dirección con ID ${id} no existe.`);
  }

  return await prisma.direccion.update({
    where: { id },
    data,
    select: direccionSelect,
  });
};

export const deleteDireccionService = async (id: number) => {
  const existingDireccion = await prisma.direccion.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingDireccion) {
    throw new NotFoundError(
      `La dirección con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay usuarios activos asociados a esta dirección
  const activeUsuariosCount = await prisma.usuario.count({
    where: { direccionId: id, deletedAt: null },
  });

  if (activeUsuariosCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la dirección porque está asociada a usuarios activos."
    );
  }

  // Verificar si hay comandas de aplicación activas asociadas a esta dirección
  const activeComandasCount = await prisma.comanda.count({
    where: { direccionId: id, deletedAt: null },
  });

  if (activeComandasCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la dirección porque está asociada a comandas de aplicación activas."
    );
  }

  return await prisma.direccion.delete({
    where: { id },
    select: direccionSelect,
  });
};
