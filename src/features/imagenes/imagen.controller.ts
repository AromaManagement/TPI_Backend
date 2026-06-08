import type { Request, Response } from "express";
import {
  createImagenService,
  getAllImagenesService,
  getImagenByIdService,
  updateImagenService,
  deleteImagenService,
} from "./imagen.services.js";

export const createImagen = async (req: Request, res: Response) => {
  const data = req.body;
  const newImagen = await createImagenService(data);

  res.status(201).json({
    status: "success",
    message: "Imagen registrada exitosamente.",
    data: newImagen,
  });
};

export const getAllImagenes = async (req: Request, res: Response) => {
  const imagenes = await getAllImagenesService();

  res.status(200).json({
    status: "success",
    message: "Imágenes recuperadas exitosamente.",
    data: imagenes,
  });
};

export const getImagenById = async (req: Request, res: Response) => {
  const imagenId = parseInt(req.params.imagenId as string, 10);
  const imagen = await getImagenByIdService(imagenId);

  res.status(200).json({
    status: "success",
    message: "Imagen recuperada exitosamente.",
    data: imagen,
  });
};

export const updateImagen = async (req: Request, res: Response) => {
  const imagenId = parseInt(req.params.imagenId as string, 10);
  const data = req.body;
  const updatedImagen = await updateImagenService(imagenId, data);

  res.status(200).json({
    status: "success",
    message: "Imagen actualizada exitosamente.",
    data: updatedImagen,
  });
};

export const deleteImagen = async (req: Request, res: Response) => {
  const imagenId = parseInt(req.params.imagenId as string, 10);
  const deletedImagen = await deleteImagenService(imagenId);

  res.status(200).json({
    status: "success",
    message: "Imagen eliminada exitosamente.",
    data: deletedImagen,
  });
};
