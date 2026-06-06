import type { Request, Response } from "express";
import {
  createSeccionService,
  getAllSeccionesService,
  getSeccionByIdService,
  updateSeccionService,
  deleteSeccionService,
} from "./seccion.services.js";

export const createSeccion = async (req: Request, res: Response) => {
  const data = req.body;
  const newSeccion = await createSeccionService(data);

  res.status(201).json({
    status: "success",
    message: "Sección creada exitosamente.",
    data: newSeccion,
  });
};

export const getAllSecciones = async (req: Request, res: Response) => {
  const secciones = await getAllSeccionesService();

  res.status(200).json({
    status: "success",
    message: "Secciones recuperadas exitosamente.",
    data: secciones,
  });
};

export const getSeccionById = async (req: Request, res: Response) => {
  const seccionId = parseInt(req.params.seccionId as string, 10);
  const seccion = await getSeccionByIdService(seccionId);

  res.status(200).json({
    status: "success",
    message: "Sección recuperada exitosamente.",
    data: seccion,
  });
};

export const updateSeccion = async (req: Request, res: Response) => {
  const seccionId = parseInt(req.params.seccionId as string, 10);
  const data = req.body;
  const updatedSeccion = await updateSeccionService(seccionId, data);

  res.status(200).json({
    status: "success",
    message: "Sección actualizada exitosamente.",
    data: updatedSeccion,
  });
};

export const deleteSeccion = async (req: Request, res: Response) => {
  const seccionId = parseInt(req.params.seccionId as string, 10);
  const deletedSeccion = await deleteSeccionService(seccionId);

  res.status(200).json({
    status: "success",
    message: "Sección eliminada exitosamente.",
    data: deletedSeccion,
  });
};
