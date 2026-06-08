import type { Response, Request } from "express";
import {
  getAllComandasService,
    getComandaByIdService,
    createComandaService,
    updateComandaService,
    deleteComandaService,
    } from "./comandas.services.js";

export const createComanda = async (req: Request, res: Response) => {
    const data = req.body;

    data.fechaSolicitud = new Date().toISOString(); 
    data.clienteId = req.user?.id; 

    const newComanda = await createComandaService(data);

    res.status(201).json({
        status: "success",
        message: "Comanda creada exitosamente.",
        data: newComanda,
    });
};

export const getAllComandas = async (req: Request, res: Response) => {
    const comandas = await getAllComandasService();
    
    res.status(200).json({
        status: "success",
        message: "Comandas recuperadas exitosamente.",
        data: comandas,
    });
}

export const getComandaById = async (req: Request, res: Response) => {
    const comandaId = parseInt(req.params.comandaId as string, 10);
    const comanda = await getComandaByIdService(comandaId);
    
    res.status(200).json({
        status: "success",
        message: "Comanda recuperada exitosamente.",
        data: comanda,
    });
}

export const updateComanda = async (req: Request, res: Response) => {
    const comandaId = parseInt(req.params.comandaId as string, 10);
    const data = req.body;
    const updatedComanda = await updateComandaService(comandaId, data);
    
    res.status(200).json({
        status: "success",
        message: "Comanda actualizada exitosamente.",
        data: updatedComanda,
    });
}

export const deleteComanda = async (req: Request, res: Response) => {
    const comandaId = parseInt(req.params.comandaId as string, 10);
    const deletedComanda = await deleteComandaService(comandaId);
    
    res.status(200).json({
        status: "success",
        message: "Comanda eliminada exitosamente.",
        data: deletedComanda,
    });
};
