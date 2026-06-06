import type { Request, Response } from "express";
import {
  createEstadoRecorridoService,
  getAllEstadoRecorridosService,
  getEstadoRecorridoByIdService,
  updateEstadoRecorridoService,
  deleteEstadoRecorridoService,
} from "./estado-recorrido.services.js";

export const createEstadoRecorrido = async (req: Request, res: Response) => {
  const data = req.body;
  const newEstado = await createEstadoRecorridoService(data);

  res.status(201).json({
    status: "success",
    message: "Estado de recorrido registrado exitosamente.",
    data: newEstado,
  });
};

export const getAllEstadoRecorridos = async (req: Request, res: Response) => {
  const estados = await getAllEstadoRecorridosService();

  res.status(200).json({
    status: "success",
    message: "Estados de recorrido recuperados exitosamente.",
    data: estados,
  });
};

export const getEstadoRecorridoById = async (req: Request, res: Response) => {
  const estadoRecorridoId = parseInt(
    req.params.estadoRecorridoId as string,
    10
  );
  const estado = await getEstadoRecorridoByIdService(estadoRecorridoId);

  res.status(200).json({
    status: "success",
    message: "Estado de recorrido recuperado exitosamente.",
    data: estado,
  });
};

export const updateEstadoRecorrido = async (req: Request, res: Response) => {
  const estadoRecorridoId = parseInt(
    req.params.estadoRecorridoId as string,
    10
  );
  const data = req.body;
  const updatedEstado = await updateEstadoRecorridoService(
    estadoRecorridoId,
    data
  );

  res.status(200).json({
    status: "success",
    message: "Estado de recorrido actualizado exitosamente.",
    data: updatedEstado,
  });
};

export const deleteEstadoRecorrido = async (req: Request, res: Response) => {
  const estadoRecorridoId = parseInt(
    req.params.estadoRecorridoId as string,
    10
  );
  const deletedEstado = await deleteEstadoRecorridoService(estadoRecorridoId);

  res.status(200).json({
    status: "success",
    message: "Estado de recorrido eliminado exitosamente.",
    data: deletedEstado,
  });
};
