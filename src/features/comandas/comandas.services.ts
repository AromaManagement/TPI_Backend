import { prisma } from "../../config/prisma.js";
import type { CreateComandaDto, UpdateComandaDto } from "./comanda.dto.js";
import { NotFoundError } from "../../shared/errors/app-error.js";

const comandaSelect = {
  id: true,
  clienteId: true,
  estadoComanda: true,
  fechaSolicitud: true,
  fechaEntrega: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  cliente: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
    },
  },
  detalles: true,
  direccion: true,
  repartidor: true
};

export const createComandaService = async (data: CreateComandaDto) => {
  if (data.clienteId) {
    const cliente = await prisma.usuario.findUnique({
      where: { id: data.clienteId, deletedAt: null },
    });
    if (!cliente) {
      throw new NotFoundError(`El cliente con ID ${data.clienteId} no existe.`);
    }
  }

  return prisma.comanda.create({
    data,
    select: comandaSelect,
  });
};

export const getAllComandasService = async () => {
  return prisma.comanda.findMany({
    where: { deletedAt: null },
    select: comandaSelect,
    orderBy: { createdAt: "asc" },
  });
};

export const getComandaByIdService = async (id: number) => {
  const comanda = await prisma.comanda.findUnique({
    where: { id, deletedAt: null },
    select: comandaSelect,
  });

  if (!comanda) {
    throw new NotFoundError(`La comanda con ID ${id} no existe.`);
  }

  return comanda;
};

export const updateComandaService = async (
  id: number,
  data: UpdateComandaDto,
) => {
  const existing = await prisma.comanda.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(`La comanda con ID ${id} no existe.`);
  }

  if (data.clienteId) {
    const cliente = await prisma.usuario.findUnique({
      where: { id: data.clienteId, deletedAt: null },
    });
    if (!cliente) {
      throw new NotFoundError(`El cliente con ID ${data.clienteId} no existe.`);
    }
  }

  return prisma.comanda.update({
    where: { id },
    data,
    select: comandaSelect,
  });
};

export const deleteComandaService = async (id: number) => {
  const existing = await prisma.comanda.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existing) {
    throw new NotFoundError(`La comanda con ID ${id} no existe.`);
  }

  return prisma.comanda.update({
    where: { id },
    data: { deletedAt: new Date() },
    select: comandaSelect,
  });
};

export const getActiveComandasByClienteIdService = async (clienteId: number) => {
  return prisma.comanda.findMany({
    where: {
      clienteId,
      deletedAt: null,
      estadoComanda: {
        not: "LISTO",
      },
    },
    select: comandaSelect,
    orderBy: { createdAt: "asc" },
  });
}