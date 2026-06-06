import type { Request, Response } from "express";
import {
  createPlatoArticuloService,
  getAllPlatoArticulosService,
  getPlatoArticuloByIdsService,
  updatePlatoArticuloService,
  deletePlatoArticuloService,
} from "./plato-articulo.services.js";

export const createPlatoArticulo = async (req: Request, res: Response) => {
  const data = req.body;
  const newRelation = await createPlatoArticuloService(data);

  res.status(201).json({
    status: "success",
    message: "Artículo asociado al plato exitosamente.",
    data: newRelation,
  });
};

export const getAllPlatoArticulos = async (req: Request, res: Response) => {
  const platoIdQuery = req.query.platoId
    ? parseInt(req.query.platoId as string, 10)
    : undefined;
  const articuloIdQuery = req.query.articuloId
    ? parseInt(req.query.articuloId as string, 10)
    : undefined;

  const relations = await getAllPlatoArticulosService({
    platoId: platoIdQuery,
    articuloId: articuloIdQuery,
  });

  res.status(200).json({
    status: "success",
    message: "Asociaciones plato-artículo recuperadas exitosamente.",
    data: relations,
  });
};

export const getPlatoArticuloByIds = async (req: Request, res: Response) => {
  const platoId = parseInt(req.params.platoId as string, 10);
  const articuloId = parseInt(req.params.articuloId as string, 10);

  const relation = await getPlatoArticuloByIdsService(platoId, articuloId);

  res.status(200).json({
    status: "success",
    message: "Asociación plato-artículo recuperada exitosamente.",
    data: relation,
  });
};

export const updatePlatoArticulo = async (req: Request, res: Response) => {
  const platoId = parseInt(req.params.platoId as string, 10);
  const articuloId = parseInt(req.params.articuloId as string, 10);
  const data = req.body;

  const updatedRelation = await updatePlatoArticuloService(
    platoId,
    articuloId,
    data
  );

  res.status(200).json({
    status: "success",
    message: "Cantidad de artículo en el plato actualizada exitosamente.",
    data: updatedRelation,
  });
};

export const deletePlatoArticulo = async (req: Request, res: Response) => {
  const platoId = parseInt(req.params.platoId as string, 10);
  const articuloId = parseInt(req.params.articuloId as string, 10);

  const deletedRelation = await deletePlatoArticuloService(platoId, articuloId);

  res.status(200).json({
    status: "success",
    message: "Artículo desasociado del plato exitosamente.",
    data: deletedRelation,
  });
};
