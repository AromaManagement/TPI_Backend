import type { Request, Response, NextFunction } from "express";
import { createPlatoService, getAllPlatosService, getPlatoByIdService, updatePlatoService, deletePlatoService } from "./plato.services.js";

export const createPlato = async ( req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const newPlato = await createPlatoService(data);

    res.status(201).json({
      status: "success",
      message: "Plato creado exitosamente.",
      data: newPlato,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPlatos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const platos = await getAllPlatosService();

    res.status(200).json({
      status: "success",
      message: "Platos recuperados exitosamente.",
      data: platos,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlatoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const platoId = parseInt(req.params.platoId as string, 10);
    const plato = await getPlatoByIdService(platoId);

    res.status(200).json({
      status: "success",
      message: "Plato recuperado exitosamente.",
      data: plato,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlato = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const platoId = parseInt(req.params.platoId as string, 10);
    const data = req.body;
    const updatedPlato = await updatePlatoService(platoId, data);

    res.status(200).json({
      status: "success",
      message: "Plato actualizado exitosamente.",
      data: updatedPlato,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePlato = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const platoId = parseInt(req.params.platoId as string, 10);
    const deletedPlato = await deletePlatoService(platoId);

    res.status(200).json({
      status: "success",
      message: "Plato eliminado exitosamente.",
      data: deletedPlato,
    });
  } catch (error) {
    next(error);
  }
};