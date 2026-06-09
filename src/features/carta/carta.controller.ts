import type { Request, Response } from 'express';
import {
    createCartaService,
    getAllCartaService,
    getCartaByIdService,
    updateCartaService,
    deleteCartaService,
} from './carta.services.js';
import type { CreateCartaDtoType, UpdateCartaDtoType } from './carta.dto.js';

export const createCarta = async (req: Request, res: Response) => {
    const data: CreateCartaDtoType = req.body;

    const newCarta = await createCartaService(data);

    res.status(201).json({
        status: 'success',
        message: 'Carta creada exitosamente.',
        data: newCarta,
    }); 
}

export const getAllCarta = async (req: Request, res: Response) => {
    const cartas = await getAllCartaService();

    res.status(200).json({
        status: 'success',
        message: 'Cartas recuperadas exitosamente.',
        data: cartas,
    });
}

export const getCartaById = async (req: Request, res: Response) => {
    const cartaId = parseInt(req.params.cartaId as string, 10);
    const carta = await getCartaByIdService(cartaId);
    
    res.status(200).json({
        status: 'success',
        message: 'Carta recuperada exitosamente.',
        data: carta,
    });
}

export const updateCarta = async (req: Request, res: Response) => {
    const cartaId = parseInt(req.params.cartaId as string, 10);
    const data: Partial<UpdateCartaDtoType> = req.body;

    const updatedCarta = await updateCartaService(cartaId, data);

    res.status(200).json({
        status: 'success',
        message: 'Carta actualizada exitosamente.',
        data: updatedCarta,
    });
}   

export const deleteCarta = async (req: Request, res: Response) => {
    const cartaId = parseInt(req.params.cartaId as string, 10);

    await deleteCartaService(cartaId);

    res.status(200).json({
        status: 'success',
        message: 'Carta eliminada exitosamente.',
    });
}