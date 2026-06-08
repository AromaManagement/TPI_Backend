import { prisma } from "../../config/prisma.js";
import type { CreateComandaDto, UpdateComandaDto } from "./comanda.dto.js";
import { EstadoComanda } from "@prisma/client";
import { NotFoundError } from "../../shared/errors/app-error.js";
import { de, es } from "zod/locales";
import { Decimal } from "@prisma/client/runtime/library";

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

  console.log("Data recibida para crear comanda:", data);
  if (data.clienteId) {
    const cliente = await prisma.usuario.findUnique({
      where: { id: data.clienteId, deletedAt: null },
    });
    if (!cliente) {
      throw new NotFoundError(`El cliente con ID ${data.clienteId} no existe.`);
    }
  }

 

 
  let detallesData = [];
  for (const detalle of data.detalles) {
    const plato = await prisma.platos.findUnique({
      where: { id: detalle.platoId, deletedAt: null },
    });


    if (!plato) {
      throw new NotFoundError(`El plato con ID ${detalle.platoId} no existe.`);
    }

    for (let i = 0; i < detalle.cantidad; i++) {
      detallesData.push({
        platoId: detalle.platoId,
        precioUnitario: detalle.precioUnitario ?? plato.precio,
      });
    }
  }



  return prisma.comanda.create({
    data: {
      clienteId: data.clienteId,
      estadoComanda: data.estadoComanda,
      fechaSolicitud: data.fechaSolicitud,
      fechaEntrega: data.fechaEntrega,
      direccionId: data.direccionId,
      detalles: {
        create: detallesData,
      },
    },
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


export const getActiveComandasByClienteIdService = async (clienteId: number) => {
  return prisma.comanda.findMany({
    where: {
      clienteId,
      deletedAt: null,
      estadoComanda: {
        not: "ENTREGADO",
      },
    },
    select: comandaSelect,
    orderBy: { createdAt: "asc" },
  });
}

export const updateComandaEstadoService = async (id: number, nuevoEstado: string) => {
  const comanda = await prisma.comanda.findUnique({
    where: { id, deletedAt: null },
  });
  
  if (!comanda) {
    throw new NotFoundError(`La comanda con ID ${id} no existe.`);
  }

  return prisma.comanda.update({
    where: { id },
    data: { estadoComanda: nuevoEstado as EstadoComanda },
    select: comandaSelect,
  });
};

export const getCommandasByEstadoService = async (estado: string) => {
  return prisma.comanda.findMany({
    where: {
      estadoComanda: estado as EstadoComanda,
      deletedAt: null,
    },
    select: comandaSelect,
    orderBy: { createdAt: "asc" },
  });
};

export const assignRepartidorToComandaService = async (comandaId: number, repartidorId: number) => {
  const comanda = await prisma.comanda.findUnique({
    where: { id: comandaId, deletedAt: null },
  });
  
  if (!comanda) {
    throw new NotFoundError(`La comanda con ID ${comandaId} no existe.`);
  }

  return prisma.comanda.update({
    where: { id: comandaId },
    data: { repartidorId },
    select: comandaSelect,
  });
};

export const assignChefToComandaDetalleService = async (detalleComandaId: number, chefId: number) => {
  const detalleComanda = await prisma.detalleComanda.findUnique({
    where: { id: detalleComandaId },
  });
  
  if (!detalleComanda) {
    throw new NotFoundError(`El detalle de comanda con ID ${detalleComandaId} no existe.`);
  }

  return prisma.detalleComanda.update({
    where: { id: detalleComandaId },
    data: { empleadoId: chefId },
    select: {
      id: true,
      platoId: true,
      precioUnitario: true,
      empleadoId: true,
    },
  });
};