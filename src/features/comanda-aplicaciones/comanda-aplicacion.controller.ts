import type { Request, Response } from "express";
import {
  createComandaAplicacionService,
  getAllComandaAplicacionesService,
  getComandaAplicacionByIdService,
  updateComandaAplicacionService,
  deleteComandaAplicacionService,
} from "./comanda-aplicacion.services.js";

export const createComandaAplicacion = async (req: Request, res: Response) => {
  const data = req.body;
  const newComandaApp = await createComandaAplicacionService(data);

  res.status(201).json({
    status: "success",
    message: "Comanda de aplicación registrada exitosamente.",
    data: newComandaApp,
  });
};

export const getAllComandaAplicaciones = async (
  req: Request,
  res: Response
) => {
  const comandaApps = await getAllComandaAplicacionesService();

  res.status(200).json({
    status: "success",
    message: "Comandas de aplicación recuperadas exitosamente.",
    data: comandaApps,
  });
};

export const getComandaAplicacionById = async (req: Request, res: Response) => {
  const comandaAplicacionId = parseInt(
    req.params.comandaAplicacionId as string,
    10
  );
  const comandaApp = await getComandaAplicacionByIdService(comandaAplicacionId);

  res.status(200).json({
    status: "success",
    message: "Comanda de aplicación recuperada exitosamente.",
    data: comandaApp,
  });
};

export const updateComandaAplicacion = async (req: Request, res: Response) => {
  const comandaAplicacionId = parseInt(
    req.params.comandaAplicacionId as string,
    10
  );
  const data = req.body;
  const updatedComandaApp = await updateComandaAplicacionService(
    comandaAplicacionId,
    data
  );

  res.status(200).json({
    status: "success",
    message: "Comanda de aplicación actualizada exitosamente.",
    data: updatedComandaApp,
  });
};

export const deleteComandaAplicacion = async (req: Request, res: Response) => {
  const comandaAplicacionId = parseInt(
    req.params.comandaAplicacionId as string,
    10
  );
  const deletedComandaApp = await deleteComandaAplicacionService(
    comandaAplicacionId
  );

  res.status(200).json({
    status: "success",
    message: "Comanda de aplicación eliminada exitosamente.",
    data: deletedComandaApp,
  });
};
