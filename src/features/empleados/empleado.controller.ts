import type { Request, Response } from "express";
import {
  createEmpleadoService,
  getAllEmpleadosService,
  getEmpleadoByIdService,
  updateEmpleadoService,
  deleteEmpleadoService,
} from "./empleado.services.js";

export const createEmpleado = async (req: Request, res: Response) => {
  const data = req.body;
  const newEmpleado = await createEmpleadoService(data);

  res.status(201).json({
    status: "success",
    message: "Empleado registrado exitosamente.",
    data: newEmpleado,
  });
};

export const getAllEmpleados = async (req: Request, res: Response) => {
  const empleados = await getAllEmpleadosService();

  res.status(200).json({
    status: "success",
    message: "Empleados recuperados exitosamente.",
    data: empleados,
  });
};

export const getEmpleadoById = async (req: Request, res: Response) => {
  const empleadoId = parseInt(req.params.empleadoId as string, 10);
  const empleado = await getEmpleadoByIdService(empleadoId);

  res.status(200).json({
    status: "success",
    message: "Empleado recuperado exitosamente.",
    data: empleado,
  });
};

export const updateEmpleado = async (req: Request, res: Response) => {
  const empleadoId = parseInt(req.params.empleadoId as string, 10);
  const data = req.body;
  const updatedEmpleado = await updateEmpleadoService(empleadoId, data);

  res.status(200).json({
    status: "success",
    message: "Empleado actualizado exitosamente.",
    data: updatedEmpleado,
  });
};

export const deleteEmpleado = async (req: Request, res: Response) => {
  const empleadoId = parseInt(req.params.empleadoId as string, 10);
  const deletedEmpleado = await deleteEmpleadoService(empleadoId);

  res.status(200).json({
    status: "success",
    message: "Empleado eliminado exitosamente.",
    data: deletedEmpleado,
  });
};
