import { prisma } from "../../config/prisma.js";
import type { CreateSeccionDto, UpdateSeccionDto } from "./seccion.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const seccionSelect = {
  id: true,
  cartaId: true,
  nombre: true,
  detalle: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  carta: {
    select: {
      id: true,
    },
  },
  platos: {
    where: { deletedAt: null },
    select: {
      id: true,
      nombre: true,
      precio: true,
      detalle: true,
    },
  },
};

export const createSeccionService = async (data: CreateSeccionDto) => {
  // Validar existencia de la carta
  const cartaExists = await prisma.carta.findUnique({
    where: { id: data.cartaId, deletedAt: null },
  });
  if (!cartaExists) {
    throw new NotFoundError(`La carta con ID ${data.cartaId} no existe.`);
  }

  // Validar que no haya nombres repetidos en la misma carta
  const duplicateName = await prisma.secciones.findFirst({
    where: { cartaId: data.cartaId, nombre: data.nombre, deletedAt: null },
  });
  if (duplicateName) {
    throw new ConflictError(
      `Ya existe una sección con el nombre '${data.nombre}' en esta carta.`
    );
  }

  return await prisma.secciones.create({
    data,
    select: seccionSelect,
  });
};

export const getAllSeccionesService = async () => {
  return await prisma.secciones.findMany({
    where: { deletedAt: null },
    select: seccionSelect,
  });
};

export const getSeccionByIdService = async (id: number) => {
  const seccion = await prisma.secciones.findUnique({
    where: { id, deletedAt: null },
    select: seccionSelect,
  });

  if (!seccion) {
    throw new NotFoundError(`La sección con ID ${id} no existe.`);
  }

  return seccion;
};

export const updateSeccionService = async (
  id: number,
  data: UpdateSeccionDto
) => {
  const existingSeccion = await prisma.secciones.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingSeccion) {
    throw new NotFoundError(`La sección con ID ${id} no existe.`);
  }

  if (data.cartaId) {
    const cartaExists = await prisma.carta.findUnique({
      where: { id: data.cartaId, deletedAt: null },
    });
    if (!cartaExists) {
      throw new NotFoundError(`La carta con ID ${data.cartaId} no existe.`);
    }
  }

  if (data.nombre) {
    const cartaIdToCheck = data.cartaId || existingSeccion.cartaId;
    const duplicateName = await prisma.secciones.findFirst({
      where: {
        cartaId: cartaIdToCheck,
        nombre: data.nombre,
        id: { not: id },
        deletedAt: null,
      },
    });
    if (duplicateName) {
      throw new ConflictError(
        `Ya existe otra sección con el nombre '${data.nombre}' en esta carta.`
      );
    }
  }

  return await prisma.secciones.update({
    where: { id },
    data,
    select: seccionSelect,
  });
};

export const deleteSeccionService = async (id: number) => {
  const existingSeccion = await prisma.secciones.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingSeccion) {
    throw new NotFoundError(
      `La sección con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay platos activos asociados
  const activePlatosCount = await prisma.platos.count({
    where: { seccionId: id, deletedAt: null },
  });

  if (activePlatosCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la sección porque contiene platos activos asociados."
    );
  }

  return await prisma.secciones.delete({
    where: { id },
    select: seccionSelect,
  });
};
