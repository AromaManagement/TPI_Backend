import type { Request, Response } from "express";
import {
  createTipoEmpleadoService,
  getAllTipoEmpleadosService,
  getTipoEmpleadoByIdService,
  updateTipoEmpleadoService,
  deleteTipoEmpleadoService,
} from "./tipo-empleado.services.js";

export const createTipoEmpleado = async (req: Request, res: Response) => {
  const data = req.body;
  const newTipo = await createTipoEmpleadoService(data);

  res.status(201).json({
    status: "success",
    message: "Tipo de empleado creado exitosamente.",
    data: newTipo,
  });
};

export const getAllTipoEmpleados = async (req: Request, res: Response) => {
  const tipos = await getAllTipoEmpleadosService();

  res.status(200).json({
    status: "success",
    message: "Tipos de empleado recuperados exitosamente.",
    data: tipos,
  });
};

export const getTipoEmpleadoById = async (req: Request, res: Response) => {
  const tipoEmpleadoId = parseInt(req.params.tipoEmpleadoId as string, 10);
  const tipo = await getTipoEmpleadoByIdService(tipoEmpleadoId);

  res.status(200).json({
    status: "success",
    message: "Tipo de empleado recuperado exitosamente.",
    data: tipo,
  });
};

export const updateTipoEmpleado = async (req: Request, res: Response) => {
  const tipoEmpleadoId = parseInt(req.params.tipoEmpleadoId as string, 10);
  const data = req.body;
  const updatedTipo = await updateTipoEmpleadoService(tipoEmpleadoId, data);

  res.status(200).json({
    status: "success",
    message: "Tipo de empleado actualizado exitosamente.",
    data: updatedTipo,
  });
};

export const deleteTipoEmpleado = async (req: Request, res: Response) => {
  const tipoEmpleadoId = parseInt(req.params.tipoEmpleadoId as string, 10);
  const deletedTipo = await deleteTipoEmpleadoService(tipoEmpleadoId);

  res.status(200).json({
    status: "success",
    message: "Tipo de empleado eliminado exitosamente.",
    data: deletedTipo,
  });
};
