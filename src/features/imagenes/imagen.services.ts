import { prisma } from "../../config/prisma.js";
import type { CreateImagenDto, UpdateImagenDto } from "./imagen.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const imagenSelect = {
  id: true,
  imagenSi: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createImagenService = async (data: CreateImagenDto) => {
  return await prisma.imagen.create({
    data,
    select: imagenSelect,
  });
};

export const getAllImagenesService = async () => {
  return await prisma.imagen.findMany({
    where: { deletedAt: null },
    select: imagenSelect,
  });
};

export const getImagenByIdService = async (id: number) => {
  const imagen = await prisma.imagen.findUnique({
    where: { id, deletedAt: null },
    select: imagenSelect,
  });

  if (!imagen) {
    throw new NotFoundError(`La imagen con ID ${id} no existe.`);
  }

  return imagen;
};

export const updateImagenService = async (id: number, data: UpdateImagenDto) => {
  const existingImagen = await prisma.imagen.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingImagen) {
    throw new NotFoundError(`La imagen con ID ${id} no existe.`);
  }

  return await prisma.imagen.update({
    where: { id },
    data,
    select: imagenSelect,
  });
};

export const deleteImagenService = async (id: number) => {
  const existingImagen = await prisma.imagen.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingImagen) {
    throw new NotFoundError(
      `La imagen con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay platos activos asociados a esta imagen
  const activePlatosCount = await prisma.platos.count({
    where: { imagenId: id, deletedAt: null },
  });

  if (activePlatosCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la imagen porque está asociada a platos activos."
    );
  }

  return await prisma.imagen.delete({
    where: { id },
    select: imagenSelect,
  });
};
