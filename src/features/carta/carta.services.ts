import { prisma } from "../../config/prisma.js";
import type { CreateCartaDto, CreateCartaDtoType } from "./carta.dto.js";
import { NotFoundError } from "../../shared/errors/app-error.js";

const cartaSelect = {  
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
};

export const createCartaService = async (data: CreateCartaDtoType) => {
    const nuevaCarta = await prisma.carta.create({
        data: {
        },
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
            updatedAt: new Date(),
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