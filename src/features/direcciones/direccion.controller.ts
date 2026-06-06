import type { Request, Response } from "express";
import {
  createDireccionService,
  getAllDireccionesService,
  getDireccionByIdService,
  updateDireccionService,
  deleteDireccionService,
} from "./direccion.services.js";

export const createDireccion = async (req: Request, res: Response) => {
  const data = req.body;
  const newDireccion = await createDireccionService(data);

  res.status(201).json({
    status: "success",
    message: "Dirección creada exitosamente.",
    data: newDireccion,
  });
};

export const getAllDirecciones = async (req: Request, res: Response) => {
  const direcciones = await getAllDireccionesService();

  res.status(200).json({
    status: "success",
    message: "Direcciones recuperadas exitosamente.",
    data: direcciones,
  });
};

export const getDireccionById = async (req: Request, res: Response) => {
  const direccionId = parseInt(req.params.direccionId as string, 10);
  const direccion = await getDireccionByIdService(direccionId);

  res.status(200).json({
    status: "success",
    message: "Dirección recuperada exitosamente.",
    data: direccion,
  });
};

export const updateDireccion = async (req: Request, res: Response) => {
  const direccionId = parseInt(req.params.direccionId as string, 10);
  const data = req.body;
  const updatedDireccion = await updateDireccionService(direccionId, data);

  res.status(200).json({
    status: "success",
    message: "Dirección actualizada exitosamente.",
    data: updatedDireccion,
  });
};

export const deleteDireccion = async (req: Request, res: Response) => {
  const direccionId = parseInt(req.params.direccionId as string, 10);
  const deletedDireccion = await deleteDireccionService(direccionId);

  res.status(200).json({
    status: "success",
    message: "Dirección eliminada exitosamente.",
    data: deletedDireccion,
  });
};
