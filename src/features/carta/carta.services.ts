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
    
  const cartaExistente = await prisma.carta.findFirst({
        where: { id, deletedAt: null },
    });

    if (!cartaExistente) {
        throw new NotFoundError(`No se encontró una carta activa con ID ${id}.`);
    }

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
    
    const cartaExistente = await prisma.carta.findFirst({
        where: { id, deletedAt: null },
    });

    if (!cartaExistente) {
        throw new NotFoundError(`No se encontró una carta activa con ID ${id}.`);
    }

    await prisma.carta.update({
        where: { id },
        data: { deletedAt: new Date() },
    });
};

export const getCartaDisponiblesService = async () => {

  const ultimaCarta = await prisma.carta.findFirst({
    where: { deletedAt: null }, // 
    orderBy: { createdAt: "desc" },
  });

  if (!ultimaCarta) {
    throw new NotFoundError("No se encontró una carta activa en el sistema.");
  }
  
  const seccionesDeLaCarta = await prisma.secciones.findMany({
    where: { 
      cartaId: ultimaCarta.id,  
      deletedAt: null           
    },
    include: {
      platos: {
        where: { deletedAt: null }, 
        include: {
          articulos: { 
            include: {
              articulo: {
                include: {
                  stock: true 
                }
              }
            }
          }
        }
      }
    }
  });

const resultadoFiltrado = seccionesDeLaCarta.map(seccion => {
    const platosConStock = seccion.platos.filter(plato => {
      
      if (!plato.articulos || plato.articulos.length === 0) {
        return false;
      }

      return plato.articulos.every(platoArticulo => {
        const cantidadRequerida = Number(platoArticulo.cantidad || 0);
        const stockActual = Number(platoArticulo.articulo.stock?.cantidad || 0);
        return stockActual >= cantidadRequerida;
      });
    });

    const platosLimpios = platosConStock.map(plato => {
      return {
        id: plato.id,
        seccionId: plato.seccionId,
        nombre: plato.nombre,
        precio: plato.precio,
        detalle: plato.detalle,
        imagenId: plato.imagenId,
        createdAt: plato.createdAt,
        updatedAt: plato.updatedAt,
        deletedAt: plato.deletedAt
      };
    });

    return {
      id: seccion.id, 
      cartaId: seccion.cartaId, 
      nombre: seccion.nombre, 
      detalle: seccion.detalle, 
      createdAt: seccion.createdAt, 
      updatedAt: seccion.updatedAt, 
      deletedAt: seccion.deletedAt,  
      platos: platosLimpios
    };
  })
  .filter(seccion => seccion.platos.length > 0);

  return resultadoFiltrado;
};