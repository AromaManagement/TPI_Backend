import { prisma } from "../../config/prisma.js";
import type { CreateCartaDtoType } from "./carta.dto.js";
import { NotFoundError } from "../../shared/errors/app-error.js";

const cartaSelect = {  
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
};

export const createCartaService = async (data: CreateCartaDtoType) => {
    const nuevaCarta = await prisma.carta.create({
        data: {},
        select: cartaSelect,
    });

    return nuevaCarta;
};

export const getAllCartaService = async () => {
    return await prisma.carta.findMany({
        where: { deletedAt: null },
        select: cartaSelect,
    });
};

export const getCartaByIdService = async (id: number) => {
    const carta = await prisma.carta.findFirst({
        where: { id, deletedAt: null },
        select: cartaSelect,
    });

    if (!carta) {
        throw new NotFoundError(`No se encontró una carta activa con ID ${id}.`);
    }

    return carta;
};

export const updateCartaService = async (id: number, data: Partial<CreateCartaDtoType>) => {
    // Verificar que la carta existe y no está eliminada
    const cartaExistente = await prisma.carta.findFirst({
        where: { id, deletedAt: null },
    });

    if (!cartaExistente) {
        throw new NotFoundError(`No se encontró una carta activa con ID ${id}.`);
    }

    // Actualizar la carta
    const cartaActualizada = await prisma.carta.update({
        where: { id },
        data: {
            ...data,
        },
        select: cartaSelect,
    });

    return cartaActualizada;
};

export const deleteCartaService = async (id: number) => {
    // Verificar que la carta existe y no está eliminada
    const cartaExistente = await prisma.carta.findFirst({
        where: { id, deletedAt: null },
    });

    if (!cartaExistente) {
        throw new NotFoundError(`No se encontró una carta activa con ID ${id}.`);
    }

    // Marcar la carta como eliminada (soft delete)
    await prisma.carta.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};

export const getCartaDisponiblesService = async () => {
  // 1. Buscamos primero la última carta activa para conocer su ID
  const ultimaCarta = await prisma.carta.findFirst({
    where: { deletedAt: null }, // 
    orderBy: { createdAt: "desc" },
  });

  if (!ultimaCarta) {
    throw new NotFoundError("No se encontró una carta activa en el sistema.");
  }

  // 2. Buscamos las secciones que pertenecen a esa carta (mediante cartaId)
  const seccionesDeLaCarta = await prisma.secciones.findMany({
    where: { 
      cartaId: ultimaCarta.id, // Una sección pertenece a la carta 
      deletedAt: null          // 
    },
    include: {
      // Aunque el plato pertenezca a la sección, Prisma te permite traer 
      // todos los platos que tienen este seccionId usando la relación virtual 'platos'
      platos: {
        where: { deletedAt: null }, // [cite: 24]
        include: {
          articulos: { // Relación N:M hacia los ingredientes [cite: 24]
            include: {
              articulo: {
                include: {
                  stock: true // Ficha de stock del ingrediente [cite: 15]
                }
              }
            }
          }
        }
      }
    }
  });

  // 3. Filtramos en memoria los platos que sí tienen stock suficiente para cocinarse
  const resultadoFiltrado = seccionesDeLaCarta.map(seccion => {
    const platosConStock = seccion.platos.filter(plato => {
      
      // Si el plato no tiene ingredientes definidos, no se puede calcular stock
      if (!plato.articulos || plato.articulos.length === 0) {
        return false;
      }

      // El plato está disponible si TODOS sus ingredientes cubren la receta
      return plato.articulos.every(platoArticulo => {
        const cantidadRequerida = Number(platoArticulo.cantidad || 0); // [cite: 26]
        const stockActual = Number(platoArticulo.articulo.stock?.cantidad || 0); // [cite: 16]

        // Regla: Stock en la BD >= Cantidad requerida por la receta
        return stockActual >= cantidadRequerida;
      });
    });

    // Devolvemos la estructura de la sección pero sólo con sus platos disponibles
    return {
      id: seccion.id, // [cite: 21]
      cartaId: seccion.cartaId, // [cite: 21]
      nombre: seccion.nombre, // [cite: 21]
      detalle: seccion.detalle, // [cite: 21]
      createdAt: seccion.createdAt, // [cite: 21]
      updatedAt: seccion.updatedAt, // [cite: 21]
      deletedAt: seccion.deletedAt, // 
      platos: platosConStock
    };
  })
  // Opcional: Si una sección se quedó con 0 platos con stock, la ocultamos de la carta
  .filter(seccion => seccion.platos.length > 0);

  return resultadoFiltrado;
};