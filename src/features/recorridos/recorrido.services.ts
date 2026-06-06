import { prisma } from "../../config/prisma.js";
import type { CreateRecorridoDto, UpdateRecorridoDto } from "./recorrido.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const recorridoSelect = {
  id: true,
  comandaAplicacionId: true,
  recorridoId: true,
  fechaFin: true,
  fechaIn: true,
  coordIn: true,
  coordFin: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  comandaAplicacion: {
    select: {
      id: true,
      comandaId: true,
    },
  },
  estadosRecorrido: {
    where: { deletedAt: null },
    select: {
      id: true,
      nombre: true,
    },
  },
};

export const createRecorridoService = async (data: CreateRecorridoDto) => {
  if (data.comandaAplicacionId) {
    const comandaAppExists = await prisma.comandaAplicacion.findUnique({
      where: { id: data.comandaAplicacionId, deletedAt: null },
    });
    if (!comandaAppExists) {
      throw new NotFoundError(
        `La comanda de aplicación con ID ${data.comandaAplicacionId} no existe.`
      );
    }
  }

  return await prisma.recorrido.create({
    data,
    select: recorridoSelect,
  });
};

export const getAllRecorridosService = async () => {
  return await prisma.recorrido.findMany({
    where: { deletedAt: null },
    select: recorridoSelect,
  });
};

export const getRecorridoByIdService = async (id: number) => {
  const recorrido = await prisma.recorrido.findUnique({
    where: { id, deletedAt: null },
    select: recorridoSelect,
  });

  if (!recorrido) {
    throw new NotFoundError(`El recorrido con ID ${id} no existe.`);
  }

  return recorrido;
};

export const updateRecorridoService = async (
  id: number,
  data: UpdateRecorridoDto
) => {
  const existingRecorrido = await prisma.recorrido.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingRecorrido) {
    throw new NotFoundError(`El recorrido con ID ${id} no existe.`);
  }

  if (data.comandaAplicacionId) {
    const comandaAppExists = await prisma.comandaAplicacion.findUnique({
      where: { id: data.comandaAplicacionId, deletedAt: null },
    });
    if (!comandaAppExists) {
      throw new NotFoundError(
        `La comanda de aplicación con ID ${data.comandaAplicacionId} no existe.`
      );
    }
  }

  return await prisma.recorrido.update({
    where: { id },
    data,
    select: recorridoSelect,
  });
};

export const deleteRecorridoService = async (id: number) => {
  const existingRecorrido = await prisma.recorrido.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingRecorrido) {
    throw new NotFoundError(
      `El recorrido con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay estados de recorrido activos asociados
  const activeEstadosCount = await prisma.estadoRecorrido.count({
    where: { recorridoId: id, deletedAt: null },
  });

  if (activeEstadosCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el recorrido porque tiene estados de recorrido asociados."
    );
  }

  return await prisma.recorrido.delete({
    where: { id },
    select: recorridoSelect,
  });
};
