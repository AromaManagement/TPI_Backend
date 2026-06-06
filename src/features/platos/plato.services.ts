import { prisma } from "../../config/prisma.js";
import type { CreatePlatoDto, UpdatePlatoDto } from "./plato.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const platoSelect = {
  id: true,
  seccionId: true,
  nombre: true,
  precio: true,
  detalle: true,
  imagenId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  seccion: {
    select: {
      id: true,
      nombre: true,
    },
  },
  imagen: {
    select: {
      id: true,
      imagenSi: true,
    },
  },
  articulos: {
    select: {
      articuloId: true,
      cantidad: true,
      articulo: {
        select: {
          nombre: true,
        },
      },
    },
  },
};

export const createPlatoService = async (data: CreatePlatoDto) => {
  // Validar existencia de la sección
  const seccionExists = await prisma.secciones.findUnique({
    where: { id: data.seccionId, deletedAt: null },
  });
  if (!seccionExists) {
    throw new NotFoundError(`La sección con ID ${data.seccionId} no existe.`);
  }

  // Validar existencia de la imagen si se provee
  if (data.imagenId) {
    const imagenExists = await prisma.imagen.findUnique({
      where: { id: data.imagenId, deletedAt: null },
    });
    if (!imagenExists) {
      throw new NotFoundError(`La imagen con ID ${data.imagenId} no existe.`);
    }
  }

  return await prisma.platos.create({
    data: {
      seccionId: data.seccionId,
      nombre: data.nombre,
      precio: data.precio,
      detalle: data.detalle,
      imagenId: data.imagenId,
    },
    select: platoSelect,
  });
};

export const getAllPlatosService = async () => {
  return await prisma.platos.findMany({
    where: { deletedAt: null },
    select: platoSelect,
  });
};

export const getPlatoByIdService = async (id: number) => {
  const plato = await prisma.platos.findUnique({
    where: { id, deletedAt: null },
    select: platoSelect,
  });

  if (!plato) {
    throw new NotFoundError(`El plato con ID ${id} no existe.`);
  }

  return plato;
};

export const updatePlatoService = async (id: number, data: UpdatePlatoDto) => {
  const existingPlato = await prisma.platos.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingPlato) {
    throw new NotFoundError(`El plato con ID ${id} no existe.`);
  }

  if (data.seccionId) {
    const seccionExists = await prisma.secciones.findUnique({
      where: { id: data.seccionId, deletedAt: null },
    });
    if (!seccionExists) {
      throw new NotFoundError(`La sección con ID ${data.seccionId} no existe.`);
    }
  }

  if (data.imagenId) {
    const imagenExists = await prisma.imagen.findUnique({
      where: { id: data.imagenId, deletedAt: null },
    });
    if (!imagenExists) {
      throw new NotFoundError(`La imagen con ID ${data.imagenId} no existe.`);
    }
  }

  return await prisma.platos.update({
    where: { id },
    data: {
      seccionId: data.seccionId,
      nombre: data.nombre,
      precio: data.precio,
      detalle: data.detalle,
      imagenId: data.imagenId,
    },
    select: platoSelect,
  });
};

export const deletePlatoService = async (id: number) => {
  const existingPlato = await prisma.platos.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingPlato) {
    throw new NotFoundError(
      `El plato con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay detalles de comanda activos asociados
  const activeComandasCount = await prisma.detalleComanda.count({
    where: { platoId: id, deletedAt: null },
  });

  if (activeComandasCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el plato porque está asociado a detalles de comandas activas."
    );
  }

  return await prisma.platos.delete({
    where: { id },
    select: platoSelect,
  });
};
