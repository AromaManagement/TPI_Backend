import type { Request, Response } from "express";
import {
  createPersonaService,
  getAllPersonasService,
  getPersonaByIdService,
  updatePersonaService,
  deletePersonaService,
} from "./persona.services.js";

export const createPersona = async (req: Request, res: Response) => {
  const data = req.body;
  const newPersona = await createPersonaService(data);

  res.status(201).json({
    status: "success",
    message: "Persona creada exitosamente.",
    data: newPersona,
  });
};

export const getAllPersonas = async (req: Request, res: Response) => {
  const personas = await getAllPersonasService();

  res.status(200).json({
    status: "success",
    message: "Personas recuperadas exitosamente.",
    data: personas,
  });
};

export const getPersonaById = async (req: Request, res: Response) => {
  const personaId = parseInt(req.params.personaId as string, 10);
  const persona = await getPersonaByIdService(personaId);

  res.status(200).json({
    status: "success",
    message: "Persona recuperada exitosamente.",
    data: persona,
  });
};

export const updatePersona = async (req: Request, res: Response) => {
  const personaId = parseInt(req.params.personaId as string, 10);
  const data = req.body;
  const updatedPersona = await updatePersonaService(personaId, data);

  res.status(200).json({
    status: "success",
    message: "Persona actualizada exitosamente.",
    data: updatedPersona,
  });
};

export const deletePersona = async (req: Request, res: Response) => {
  const personaId = parseInt(req.params.personaId as string, 10);
  const deletedPersona = await deletePersonaService(personaId);

  res.status(200).json({
    status: "success",
    message: "Persona eliminada exitosamente.",
    data: deletedPersona,
  });
};
