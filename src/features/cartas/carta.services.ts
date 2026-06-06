import { prisma } from "../../config/prisma.js";
import { Prisma } from "@prisma/client";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const cartaSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  secciones: {
    where: { deletedAt: null },
    select: {
      id: true,
      nombre: true,
      detalle: true,
    },
  },
};

export const createCartaService = async () => {
  return await prisma.carta.create({
    data: {} as Prisma.CartaCreateInput,
    select: cartaSelect,
  });
};

export const getAllCartasService = async () => {
  return await prisma.carta.findMany({
    where: { deletedAt: null },
    select: cartaSelect,
  });
};

export const getCartaByIdService = async (id: number) => {
  const carta = await prisma.carta.findUnique({
    where: { id, deletedAt: null },
    select: cartaSelect,
  });

  if (!carta) {
    throw new NotFoundError(`La carta con ID ${id} no existe.`);
  }

  return carta;
};

export const updateCartaService = async (id: number) => {
  const existingCarta = await prisma.carta.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingCarta) {
    throw new NotFoundError(`La carta con ID ${id} no existe.`);
  }

  return await prisma.carta.update({
    where: { id },
    data: {} as Prisma.CartaUpdateInput,
    select: cartaSelect,
  });
};

export const deleteCartaService = async (id: number) => {
  const existingCarta = await prisma.carta.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingCarta) {
    throw new NotFoundError(
      `La carta con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay secciones activas asociadas
  const activeSeccionesCount = await prisma.secciones.count({
    where: { cartaId: id, deletedAt: null },
  });

  if (activeSeccionesCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la carta porque contiene secciones activas asociadas."
    );
  }

  return await prisma.carta.delete({
    where: { id },
    select: cartaSelect,
  });
};
