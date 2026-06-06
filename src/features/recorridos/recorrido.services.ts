import { prisma } from "../../config/prisma.js";
import type { CreateRecorridoDto, UpdateRecorridoDto } from "./recorrido.dto.js";
import { NotFoundError } from "../../shared/errors/app-error.js";

const recorridoSelect = {
  id: true,
  comandaAplicacionId: true,
  empleadoId: true,
  estado: true,
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
  empleado: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      rol: true,
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

  if (data.empleadoId) {
    const empleadoExists = await prisma.usuario.findUnique({
      where: { id: data.empleadoId, deletedAt: null },
    });
    if (!empleadoExists) {
      throw new NotFoundError(
        `El empleado (usuario) con ID ${data.empleadoId} no existe.`
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

  if (data.empleadoId) {
    const empleadoExists = await prisma.usuario.findUnique({
      where: { id: data.empleadoId, deletedAt: null },
    });
    if (!empleadoExists) {
      throw new NotFoundError(
        `El empleado (usuario) con ID ${data.empleadoId} no existe.`
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

  return await prisma.recorrido.delete({
    where: { id },
    select: recorridoSelect,
  });
};
