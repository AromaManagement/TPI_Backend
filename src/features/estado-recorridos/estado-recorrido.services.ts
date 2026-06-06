import { prisma } from "../../config/prisma.js";
import type {
  CreateEstadoRecorridoDto,
  UpdateEstadoRecorridoDto,
} from "./estado-recorrido.dto.js";
import { NotFoundError } from "../../shared/errors/app-error.js";

const estadoRecorridoSelect = {
  id: true,
  nombre: true,
  recorridoId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  recorrido: {
    select: {
      id: true,
      coordIn: true,
      coordFin: true,
    },
  },
};

export const createEstadoRecorridoService = async (
  data: CreateEstadoRecorridoDto
) => {
  if (data.recorridoId) {
    const recorridoExists = await prisma.recorrido.findUnique({
      where: { id: data.recorridoId, deletedAt: null },
    });
    if (!recorridoExists) {
      throw new NotFoundError(`El recorrido con ID ${data.recorridoId} no existe.`);
    }
  }

  return await prisma.estadoRecorrido.create({
    data,
    select: estadoRecorridoSelect,
  });
};

export const getAllEstadoRecorridosService = async () => {
  return await prisma.estadoRecorrido.findMany({
    where: { deletedAt: null },
    select: estadoRecorridoSelect,
  });
};

export const getEstadoRecorridoByIdService = async (id: number) => {
  const estado = await prisma.estadoRecorrido.findUnique({
    where: { id, deletedAt: null },
    select: estadoRecorridoSelect,
  });

  if (!estado) {
    throw new NotFoundError(`El estado del recorrido con ID ${id} no existe.`);
  }

  return estado;
};

export const updateEstadoRecorridoService = async (
  id: number,
  data: UpdateEstadoRecorridoDto
) => {
  const existingEstado = await prisma.estadoRecorrido.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingEstado) {
    throw new NotFoundError(`El estado del recorrido con ID ${id} no existe.`);
  }

  if (data.recorridoId) {
    const recorridoExists = await prisma.recorrido.findUnique({
      where: { id: data.recorridoId, deletedAt: null },
    });
    if (!recorridoExists) {
      throw new NotFoundError(`El recorrido con ID ${data.recorridoId} no existe.`);
    }
  }

  return await prisma.estadoRecorrido.update({
    where: { id },
    data,
    select: estadoRecorridoSelect,
  });
};

export const deleteEstadoRecorridoService = async (id: number) => {
  const existingEstado = await prisma.estadoRecorrido.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingEstado) {
    throw new NotFoundError(
      `El estado del recorrido con ID ${id} no existe y no se puede eliminar.`
    );
  }

  return await prisma.estadoRecorrido.delete({
    where: { id },
    select: estadoRecorridoSelect,
  });
};
