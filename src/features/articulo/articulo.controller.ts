import type { Request, Response } from "express";
import {
  createArticuloService,
  getAllArticulosService,
  getArticuloByIdService,
  updateArticuloService,
  deleteArticuloService,
} from "./articulo.services.js";

export const createArticulo = async (req: Request, res: Response) => {
  const data = req.body;

  const newArticulo = await createArticuloService(data);

  res.status(201).json({
    status: "success",
    message: "Artículo creado exitosamente.",
    data: newArticulo,
  });
};

export const getAllArticulos = async (req: Request, res: Response) => {
  const articulos = await getAllArticulosService();

  res.status(200).json({
    status: "success",
    message: "Artículos recuperados exitosamente.",
    data: articulos,
  });
};

export const getArticuloById = async (req: Request, res: Response) => {
  const articuloId = parseInt(req.params.articuloId as string, 10);
  const articulo = await getArticuloByIdService(articuloId);

  res.status(200).json({
    status: "success",
    message: "Artículo recuperado exitosamente.",
    data: articulo,
  });
};

export const updateArticulo = async (req: Request, res: Response) => {
  const articuloId = parseInt(req.params.articuloId as string, 10);
  const data = req.body;
  const updatedArticulo = await updateArticuloService(articuloId, data);

  res.status(200).json({
    status: "success",
    message: "Artículo actualizado exitosamente.",
    data: updatedArticulo,
  });
};

export const deleteArticulo = async (req: Request, res: Response) => {
  const articuloId = parseInt(req.params.articuloId as string, 10);
  const deletedArticulo = await deleteArticuloService(articuloId);

  res.status(200).json({
    status: "success",
    message: "Artículo eliminado exitosamente.",
    data: deletedArticulo,
  });
};