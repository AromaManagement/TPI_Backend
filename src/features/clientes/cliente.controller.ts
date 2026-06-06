import type { Request, Response } from "express";
import {
  createClienteService,
  getAllClientesService,
  getClienteByIdService,
  updateClienteService,
  deleteClienteService,
} from "./cliente.services.js";

export const createCliente = async (req: Request, res: Response) => {
  const data = req.body;
  const newCliente = await createClienteService(data);

  res.status(201).json({
    status: "success",
    message: "Cliente registrado exitosamente.",
    data: newCliente,
  });
};

export const getAllClientes = async (req: Request, res: Response) => {
  const clientes = await getAllClientesService();

  res.status(200).json({
    status: "success",
    message: "Clientes recuperados exitosamente.",
    data: clientes,
  });
};

export const getClienteById = async (req: Request, res: Response) => {
  const clienteId = parseInt(req.params.clienteId as string, 10);
  const cliente = await getClienteByIdService(clienteId);

  res.status(200).json({
    status: "success",
    message: "Cliente recuperado exitosamente.",
    data: cliente,
  });
};

export const updateCliente = async (req: Request, res: Response) => {
  const clienteId = parseInt(req.params.clienteId as string, 10);
  const data = req.body;
  const updatedCliente = await updateClienteService(clienteId, data);

  res.status(200).json({
    status: "success",
    message: "Cliente actualizado exitosamente.",
    data: updatedCliente,
  });
};

export const deleteCliente = async (req: Request, res: Response) => {
  const clienteId = parseInt(req.params.clienteId as string, 10);
  const deletedCliente = await deleteClienteService(clienteId);

  res.status(200).json({
    status: "success",
    message: "Cliente eliminado exitosamente.",
    data: deletedCliente,
  });
};
