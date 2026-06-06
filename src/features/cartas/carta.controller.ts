import type { Request, Response } from "express";
import {
  createCartaService,
  getAllCartasService,
  getCartaByIdService,
  updateCartaService,
  deleteCartaService,
} from "./carta.services.js";

export const createCarta = async (req: Request, res: Response) => {
  const newCarta = await createCartaService();

  res.status(201).json({
    status: "success",
    message: "Carta creada exitosamente.",
    data: newCarta,
  });
};

export const getAllCartas = async (req: Request, res: Response) => {
  const cartas = await getAllCartasService();

  res.status(200).json({
    status: "success",
    message: "Cartas recuperadas exitosamente.",
    data: cartas,
  });
};

export const getCartaById = async (req: Request, res: Response) => {
  const cartaId = parseInt(req.params.cartaId as string, 10);
  const carta = await getCartaByIdService(cartaId);

  res.status(200).json({
    status: "success",
    message: "Carta recuperada exitosamente.",
    data: carta,
  });
};

export const updateCarta = async (req: Request, res: Response) => {
  const cartaId = parseInt(req.params.cartaId as string, 10);
  const updatedCarta = await updateCartaService(cartaId);

  res.status(200).json({
    status: "success",
    message: "Carta actualizada exitosamente.",
    data: updatedCarta,
  });
};

export const deleteCarta = async (req: Request, res: Response) => {
  const cartaId = parseInt(req.params.cartaId as string, 10);
  const deletedCarta = await deleteCartaService(cartaId);

  res.status(200).json({
    status: "success",
    message: "Carta eliminada exitosamente.",
    data: deletedCarta,
  });
};
