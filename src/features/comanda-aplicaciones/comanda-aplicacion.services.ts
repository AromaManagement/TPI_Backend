import { prisma } from "../../config/prisma.js";
import type {
  CreateComandaAplicacionDto,
  UpdateComandaAplicacionDto,
} from "./comanda-aplicacion.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const comandaAplicacionSelect = {
  id: true,
  comandaId: true,
  direccionId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  comanda: {
    select: {
      id: true,
      fechaSolicitud: true,
      fechaEntrega: true,
    },
  },
  direccion: {
    select: {
      id: true,
      calle: true,
      numeracion: true,
      barrio: true,
    },
  },
};

export const createComandaAplicacionService = async (
  data: CreateComandaAplicacionDto
) => {
  // Validar existencia de la comanda
  const comandaExists = await prisma.comanda.findUnique({
    where: { id: data.comandaId, deletedAt: null },
  });
  if (!comandaExists) {
    throw new NotFoundError(`La comanda con ID ${data.comandaId} no existe.`);
  }

  // Validar que la comanda no esté ya asociada a otra comanda de aplicación
  const alreadyRegistered = await prisma.comandaAplicacion.findUnique({
    where: { comandaId: data.comandaId, deletedAt: null },
  });
  if (alreadyRegistered) {
    throw new ConflictError(
      `La comanda con ID ${data.comandaId} ya está asociada a una comanda de aplicación.`
    );
  }

  // Validar existencia de la dirección si se provee
  if (data.direccionId) {
    const direccionExists = await prisma.direccion.findUnique({
      where: { id: data.direccionId, deletedAt: null },
    });
    if (!direccionExists) {
      throw new NotFoundError(
        `La dirección con ID ${data.direccionId} no existe.`
      );
    }
  }

  return await prisma.comandaAplicacion.create({
    data,
    select: comandaAplicacionSelect,
  });
};

export const getAllComandaAplicacionesService = async () => {
  return await prisma.comandaAplicacion.findMany({
    where: { deletedAt: null },
    select: comandaAplicacionSelect,
  });
};

export const getComandaAplicacionByIdService = async (id: number) => {
  const comandaApp = await prisma.comandaAplicacion.findUnique({
    where: { id, deletedAt: null },
    select: comandaAplicacionSelect,
  });

  if (!comandaApp) {
    throw new NotFoundError(`La comanda de aplicación con ID ${id} no existe.`);
  }

  return comandaApp;
};

export const updateComandaAplicacionService = async (
  id: number,
  data: UpdateComandaAplicacionDto
) => {
  const existingComandaApp = await prisma.comandaAplicacion.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingComandaApp) {
    throw new NotFoundError(`La comanda de aplicación con ID ${id} no existe.`);
  }

  if (data.comandaId) {
    const comandaExists = await prisma.comanda.findUnique({
      where: { id: data.comandaId, deletedAt: null },
    });
    if (!comandaExists) {
      throw new NotFoundError(`La comanda con ID ${data.comandaId} no existe.`);
    }

    if (data.comandaId !== existingComandaApp.comandaId) {
      const alreadyRegistered = await prisma.comandaAplicacion.findUnique({
        where: { comandaId: data.comandaId, deletedAt: null },
      });
      if (alreadyRegistered) {
        throw new ConflictError(
          `La comanda con ID ${data.comandaId} ya está asociada a una comanda de aplicación.`
        );
      }
    }
  }

  if (data.direccionId) {
    const direccionExists = await prisma.direccion.findUnique({
      where: { id: data.direccionId, deletedAt: null },
    });
    if (!direccionExists) {
      throw new NotFoundError(
        `La dirección con ID ${data.direccionId} no existe.`
      );
    }
  }

  return await prisma.comandaAplicacion.update({
    where: { id },
    data,
    select: comandaAplicacionSelect,
  });
};

export const deleteComandaAplicacionService = async (id: number) => {
  const existingComandaApp = await prisma.comandaAplicacion.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingComandaApp) {
    throw new NotFoundError(
      `La comanda de aplicación con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay recorridos activos asociados
  const activeRecorridosCount = await prisma.recorrido.count({
    where: { comandaAplicacionId: id, deletedAt: null },
  });

  if (activeRecorridosCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la comanda de aplicación porque tiene recorridos asociados."
    );
  }

  return await prisma.comandaAplicacion.delete({
    where: { id },
    select: comandaAplicacionSelect,
  });
};
