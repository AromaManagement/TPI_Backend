import type { Request, Response, NextFunction } from 'express';
import {
    createCartaService,
    getAllCartaService,
    getCartaByIdService,
    updateCartaService,
    deleteCartaService,
    getCartaDisponiblesService,
    getCartaAdminService,
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
};

/** Vista completa para el panel de administración (sin filtro de stock). */
export const getCartaAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const carta = await getCartaAdminService();
    res.status(200).json({
      status: "success",
      message: "Carta admin recuperada exitosamente.",
      data: carta,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Recupera la carta filtrando y mostrando únicamente los platos que tienen stock disponible para cocinar
 */
export const getCartaDisponibles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cartaDisponible = await getCartaDisponiblesService();

    res.status(200).json({
      status: "success",
      message: "Carta de platos disponibles para preparación recuperada con éxito.",
      data: cartaDisponible,
    });
  } catch (error) {
    next(error);
  }
}