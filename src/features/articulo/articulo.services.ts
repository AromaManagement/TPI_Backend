import { prisma } from "../../config/prisma.js";
import type { CreateArticuloDto, UpdateArticuloDto } from "./articulo.dto.js";
import { ConflictError, NotFoundError } from "../../shared/errors/app-error.js";
import { UnidadMedida } from "@prisma/client";

const articuloSelect = {
  id: true,
  nombre: true,
  descripcion: true,
  unidadMedida: true,
  esIngrediente: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};  

export const createArticuloService = async (data: CreateArticuloDto) => {
  const existing = await prisma.articulo.findFirst({
    where: { nombre: data.nombre },
  });

  if (existing) {
    throw new ConflictError("El nombre del artículo ya está registrado.");
  }

  // Create articulo and stock in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const newArticulo = await tx.articulo.create({
      data: { ...data, unidadMedida: data.unidadMedida as UnidadMedida },
      select: articuloSelect,
    });

    // Create stock with cantidad = 0 when articulo is created
    await tx.stock.create({
      data: {
        articuloId: newArticulo.id,
        cantidad: 0,
        minimo: 0,
      },
    });

    return newArticulo;
  });

  return result;
}

export const getAllArticulosService = async () => {
  return prisma.articulo.findMany({
    where: { deletedAt: null },
    select: articuloSelect,
    orderBy: { createdAt: "asc" },
  });
};

export const getArticuloByIdService = async (id: number) => {
  const articulo = await prisma.articulo.findUnique({
    where: { id, deletedAt: null },
    select: articuloSelect,
  });

  if (!articulo) {
    throw new NotFoundError(`El artículo con ID ${id} no existe.`);
  }

  return articulo;
};

export const updateArticuloService = async (id: number, data: UpdateArticuloDto) => {
  const existing = await prisma.articulo.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(`El artículo con ID ${id} no existe.`);
  }

  if (data.nombre && data.nombre !== existing.nombre) {
    const nameConflict = await prisma.articulo.findFirst({
      where: { nombre: data.nombre },
    });

    if (nameConflict) {
      throw new ConflictError("El nombre del artículo ya está registrado.");
    }
  }

  return prisma.articulo.update({
    where: { id },
    data: { ...data, unidadMedida: data.unidadMedida as UnidadMedida },
    select: articuloSelect,
  });
};

export const deleteArticuloService = async (id: number) => {
  const existing = await prisma.articulo.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(`El artículo con ID ${id} no existe.`);
  }

  // Delete articulo and its stock in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Delete associated stock
    await tx.stock.updateMany({
      where: { articuloId: id, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    // Delete articulo
    const deletedArticulo = await tx.articulo.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: articuloSelect,
    });

    return deletedArticulo;
  });

  return result;
};  

