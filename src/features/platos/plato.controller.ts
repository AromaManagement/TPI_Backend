import type { Request, Response } from "express";
import {
  createPlatoService,
  getAllPlatosService,
  getPlatoByIdService,
  updatePlatoService,
  deletePlatoService,
} from "./plato.services.js";

export const createPlato = async (req: Request, res: Response) => {
  const data = req.body;
  const newPlato = await createPlatoService(data);

  res.status(201).json({
    status: "success",
    message: "Plato creado exitosamente.",
    data: newPlato,
  });
};

export const getAllPlatos = async (req: Request, res: Response) => {
  const platos = await getAllPlatosService();

  res.status(200).json({
    status: "success",
    message: "Platos recuperados exitosamente.",
    data: platos,
  });
};

export const getPlatoById = async (req: Request, res: Response) => {
  const platoId = parseInt(req.params.platoId as string, 10);
  const plato = await getPlatoByIdService(platoId);

  res.status(200).json({
    status: "success",
    message: "Plato recuperado exitosamente.",
    data: plato,
  });
};

export const updatePlato = async (req: Request, res: Response) => {
  const platoId = parseInt(req.params.platoId as string, 10);
  const data = req.body;
  const updatedPlato = await updatePlatoService(platoId, data);

  res.status(200).json({
    status: "success",
    message: "Plato actualizado exitosamente.",
    data: updatedPlato,
  });
};

export const deletePlato = async (req: Request, res: Response) => {
  const platoId = parseInt(req.params.platoId as string, 10);
  const deletedPlato = await deletePlatoService(platoId);

  res.status(200).json({
    status: "success",
    message: "Plato eliminado exitosamente.",
    data: deletedPlato,
  });
};
