import type { Request, Response } from "express";
import {
  createRecorridoService,
  getAllRecorridosService,
  getRecorridoByIdService,
  updateRecorridoService,
  deleteRecorridoService,
} from "./recorrido.services.js";

export const createRecorrido = async (req: Request, res: Response) => {
  const data = req.body;
  const newRecorrido = await createRecorridoService(data);

  res.status(201).json({
    status: "success",
    message: "Recorrido registrado exitosamente.",
    data: newRecorrido,
  });
};

export const getAllRecorridos = async (req: Request, res: Response) => {
  const recorridos = await getAllRecorridosService();

  res.status(200).json({
    status: "success",
    message: "Recorridos recuperados exitosamente.",
    data: recorridos,
  });
};

export const getRecorridoById = async (req: Request, res: Response) => {
  const recorridoId = parseInt(req.params.recorridoId as string, 10);
  const recorrido = await getRecorridoByIdService(recorridoId);

  res.status(200).json({
    status: "success",
    message: "Recorrido recuperado exitosamente.",
    data: recorrido,
  });
};

export const updateRecorrido = async (req: Request, res: Response) => {
  const recorridoId = parseInt(req.params.recorridoId as string, 10);
  const data = req.body;
  const updatedRecorrido = await updateRecorridoService(recorridoId, data);

  res.status(200).json({
    status: "success",
    message: "Recorrido actualizado exitosamente.",
    data: updatedRecorrido,
  });
};

export const deleteRecorrido = async (req: Request, res: Response) => {
  const recorridoId = parseInt(req.params.recorridoId as string, 10);
  const deletedRecorrido = await deleteRecorridoService(recorridoId);

  res.status(200).json({
    status: "success",
    message: "Recorrido eliminado exitosamente.",
    data: deletedRecorrido,
  });
};
