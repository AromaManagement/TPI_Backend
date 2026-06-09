import { prisma } from "../../config/prisma.js";
import type { CreateStockDto, UpdateStockDto } from "./stock.dto.js";
import { NotFoundError } from "../../shared/errors/app-error.js";

const stockSelect = {
  id: true,
  articuloId: true,
  cantidad: true,
  minimo: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createStockService = async (data: CreateStockDto) => {
  return prisma.stock.create({
    data: {
      articuloId: data.articuloId,
      cantidad: data.cantidad,
      minimo: data.minimo,
    },
    select: stockSelect,
  });
};

export const getAllStocksService = async () => {
  return prisma.stock.findMany({
    where: { deletedAt: null },
    select: stockSelect,
    orderBy: { createdAt: "asc" },
  });
};

export const getStockByIdService = async (id: number) => {
  const stock = await prisma.stock.findUnique({
    where: { id, deletedAt: null },
    select: stockSelect,
  });

  if (!stock) {
    throw new NotFoundError(`El stock con ID ${id} no existe.`);
  }

  return stock;
};

export const updateStockService = async (id: number, data: UpdateStockDto) => {
  const existing = await prisma.stock.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(`El stock con ID ${id} no existe.`);
  }

  return prisma.stock.update({
    where: { id },
    data: {
      articuloId: data.articuloId,
      cantidad: data.cantidad,
      minimo: data.minimo,
    },
    select: stockSelect,
  });
};

export const deleteStockService = async (id: number) => {
  const existing = await prisma.stock.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(`El stock con ID ${id} no existe.`);
  }

  return prisma.stock.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: stockSelect,
  });
};      