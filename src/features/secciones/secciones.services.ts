import { prisma } from "../../config/prisma.js";
import type { CreateSeccionDto } from "./secciones.dto.js";

const seccionSelect = {
  id: true,
  cartaId: true,
  nombre: true,
  detalle: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createSeccionService = async (data: CreateSeccionDto) => {
  return await prisma.secciones.create({
    data: {
      nombre: data.nombre,
      cartaId: data.cartaId,
      detalle: data.detalle,
    },
    select: seccionSelect,
  });
};

export const getAllSeccionesService = async () => {
  return await prisma.secciones.findMany({
    where: { deletedAt: null },
    select: seccionSelect,
  });
};

export const getSeccionByIdService = async (seccionId: number) => {
  return await prisma.secciones.findFirst({
    where: { id: seccionId, deletedAt: null },
    select: seccionSelect,
  });
};

export const updateSeccionService = async (
  seccionId: number,
  data: Partial<CreateSeccionDto>
) => {
  return await prisma.secciones.update({
    where: { id: seccionId },
    data: {
      nombre: data.nombre,
      cartaId: data.cartaId,
      detalle: data.detalle,
    },
    select: seccionSelect,
  });
};

export const deleteSeccionService = async (seccionId: number) => {
  return await prisma.secciones.update({
    where: { id: seccionId },
    data: { deletedAt: new Date() },
    select: seccionSelect,
  });
};  
