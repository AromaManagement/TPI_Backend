import { prisma } from "../../config/prisma.js";
import type {
  CreatePlatoArticuloDto,
  UpdatePlatoArticuloDto,
} from "./plato-articulo.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const platoArticuloSelect = {
  platoId: true,
  articuloId: true,
  cantidad: true,
  plato: {
    select: {
      id: true,
      nombre: true,
    },
  },
  articulo: {
    select: {
      id: true,
      nombre: true,
      esIngrediente: true,
    },
  },
};

export const createPlatoArticuloService = async (
  data: CreatePlatoArticuloDto
) => {
  // Validar existencia de plato
  const platoExists = await prisma.platos.findUnique({
    where: { id: data.platoId, deletedAt: null },
  });

  if (!platoExists) {
    throw new NotFoundError(`El plato con ID ${data.platoId} no existe.`);
  }

  // Validar existencia de articulo
  const articuloExists = await prisma.articulo.findUnique({
    where: { id: data.articuloId, deletedAt: null },
  });

  if (!articuloExists) {
    throw new NotFoundError(
      `El artículo con ID ${data.articuloId} no existe.`
    );
  }

  // Verificar si ya existe la relación
  const existingRelation = await prisma.platoArticulo.findUnique({
    where: {
      platoId_articuloId: {
        platoId: data.platoId,
        articuloId: data.articuloId,
      },
    },
  });

  if (existingRelation) {
    throw new ConflictError(
      "Este artículo ya está asociado a este plato. Utilice la actualización si desea cambiar la cantidad."
    );
  }

  return await prisma.platoArticulo.create({
    data,
    select: platoArticuloSelect,
  });
};

export const getAllPlatoArticulosService = async (filters?: {
  platoId?: number;
  articuloId?: number;
}) => {
  return await prisma.platoArticulo.findMany({
    where: {
      platoId: filters?.platoId,
      articuloId: filters?.articuloId,
      plato: { deletedAt: null },
      articulo: { deletedAt: null },
    },
    select: platoArticuloSelect,
  });
};

export const getPlatoArticuloByIdsService = async (
  platoId: number,
  articuloId: number
) => {
  const relation = await prisma.platoArticulo.findUnique({
    where: {
      platoId_articuloId: {
        platoId,
        articuloId,
      },
    },
    select: platoArticuloSelect,
  });

  if (!relation) {
    throw new NotFoundError(
      `No se encontró la asociación entre el plato ${platoId} y el artículo ${articuloId}.`
    );
  }

  return relation;
};

export const updatePlatoArticuloService = async (
  platoId: number,
  articuloId: number,
  data: UpdatePlatoArticuloDto
) => {
  const existingRelation = await prisma.platoArticulo.findUnique({
    where: {
      platoId_articuloId: {
        platoId,
        articuloId,
      },
    },
  });

  if (!existingRelation) {
    throw new NotFoundError(
      `No se encontró la asociación entre el plato ${platoId} y el artículo ${articuloId}.`
    );
  }

  return await prisma.platoArticulo.update({
    where: {
      platoId_articuloId: {
        platoId,
        articuloId,
      },
    },
    data,
    select: platoArticuloSelect,
  });
};

export const deletePlatoArticuloService = async (
  platoId: number,
  articuloId: number
) => {
  const existingRelation = await prisma.platoArticulo.findUnique({
    where: {
      platoId_articuloId: {
        platoId,
        articuloId,
      },
    },
  });

  if (!existingRelation) {
    throw new NotFoundError(
      `No se encontró la asociación entre el plato ${platoId} y el artículo ${articuloId}.`
    );
  }

  return await prisma.platoArticulo.delete({
    where: {
      platoId_articuloId: {
        platoId,
        articuloId,
      },
    },
    select: platoArticuloSelect,
  });
};
