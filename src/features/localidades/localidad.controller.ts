import type { Request, Response } from "express";
import {
  createLocalidadService,
  getAllLocalidadesService,
  getLocalidadByIdService,
  updateLocalidadService,
  deleteLocalidadService,
} from "./localidad.services.js";

export const createLocalidad = async (req: Request, res: Response) => {
  const data = req.body;
  const newLocalidad = await createLocalidadService(data);

  res.status(201).json({
    status: "success",
    message: "Localidad creada exitosamente.",
    data: newLocalidad,
  });
};

export const getAllLocalidades = async (req: Request, res: Response) => {
  const localidades = await getAllLocalidadesService();

  res.status(200).json({
    status: "success",
    message: "Localidades recuperadas exitosamente.",
    data: localidades,
  });
};

export const getLocalidadById = async (req: Request, res: Response) => {
  const localidadId = parseInt(req.params.localidadId as string, 10);
  const localidad = await getLocalidadByIdService(localidadId);

  res.status(200).json({
    status: "success",
    message: "Localidad recuperada exitosamente.",
    data: localidad,
  });
};

export const updateLocalidad = async (req: Request, res: Response) => {
  const localidadId = parseInt(req.params.localidadId as string, 10);
  const data = req.body;
  const updatedLocalidad = await updateLocalidadService(localidadId, data);

  res.status(200).json({
    status: "success",
    message: "Localidad actualizada exitosamente.",
    data: updatedLocalidad,
  });
};

export const deleteLocalidad = async (req: Request, res: Response) => {
  const localidadId = parseInt(req.params.localidadId as string, 10);
  const deletedLocalidad = await deleteLocalidadService(localidadId);

  res.status(200).json({
    status: "success",
    message: "Localidad eliminada exitosamente.",
    data: deletedLocalidad,
  });
};
