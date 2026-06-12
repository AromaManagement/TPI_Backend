import { prisma } from "../../config/prisma.js";
import type { CreatePlatoDto, UpdatePlatoDto } from "./plato.dto.js";

export const createPlatoService = async (data: CreatePlatoDto) => {
  const { seccionId, nombre, precio, detalle, imagenId, articulos } = data;

  // Crea el plato y sus relaciones con los artículos en una sola transacción
  return await prisma.$transaction(async (tx) => {
    const nuevoPlato = await tx.platos.create({
      data: {
        seccionId,
        nombre,
        precio,
        detalle,
        imagenId,
        articulos: {
          create: articulos.map((articulo) => ({
            articuloId: articulo.articuloId,
            cantidad: articulo.cantidad,
          })),
        },
      },
      select: {
        id: true,
        seccionId: true,
        nombre: true,
        precio: true,
        detalle: true,
        imagenId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Retorna el plato creado con sus relaciones --- IGNORE ---
    return nuevoPlato;
  });
};

export const getAllPlatosService = async () => {
  return await prisma.platos.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      seccionId: true,
      nombre: true,
      precio: true,
      detalle: true,
      imagenId: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
};

export const getPlatoByIdService = async (id: number) => {
  return await prisma.platos.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      seccionId: true,
      nombre: true,
      precio: true,
      detalle: true,
      imagenId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updatePlatoService = async (id: number, data: UpdatePlatoDto) => {
  const { seccionId, nombre, precio, detalle, imagenId, articulos } = data;

  return await prisma.$transaction(async (tx) => {
    const platoExistente = await tx.platos.findFirst({
      where: { id, deletedAt: null },
    });

    if (!platoExistente) {
      throw new Error(`El plato con ID ${id} no existe.`);
    }

    // Actualiza el plato
    const platoActualizado = await tx.platos.update({
      where: { id },
      data: {
        seccionId,
        nombre,
        precio,
        detalle,
        imagenId,
      },
      select: {
        id: true,
        seccionId: true,
        nombre: true,
        precio: true,
        detalle: true,
        imagenId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Sólo actualiza articulos si se enviaron en el body
    if (articulos !== undefined) {
      await tx.platoArticulo.deleteMany({ where: { platoId: id } });
      if (articulos.length > 0) {
        await tx.platoArticulo.createMany({
          data: articulos.map((articulo) => ({
            platoId: id,
            articuloId: articulo.articuloId,
            cantidad: articulo.cantidad,
          })),
        });
      }
    }

    // Retorna el plato actualizado con sus relaciones --- IGNORE ---
    return platoActualizado;
  });
};

export const deletePlatoService = async (id: number) => {
  return await prisma.platos.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
