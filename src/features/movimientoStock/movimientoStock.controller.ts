import type { Request, Response } from "express";
import {
  createMovimientoService,
  getAllMovimientoStockService,
  getMovimientoStockByIdService,
} from "./movimientoStock.services.js";

export const createMovimiento = async (req: Request, res: Response) => {
    const data = req.body; 

    const newMovimiento = await createMovimientoService(data);

    res.status(201).json({
        status: "success",
        message: "Movimiento de stock creado exitosamente.",
        data: newMovimiento,
    });
};

export const getAllMovimientoStock = async (req: Request, res: Response) => {
    const movimientos = await getAllMovimientoStockService();

    res.status(200).json({
        status: "success",
        message: "Movimientos de stock recuperados exitosamente.",
        data: movimientos,
    });
};

export const getMovimientoStockById = async (req: Request, res: Response) => {
    const movimientoId = parseInt(req.params.movimientoId as string, 10);
    const movimiento = await getMovimientoStockByIdService(movimientoId);

    res.status(200).json({
        status: "success",
        message: "Movimiento de stock recuperado exitosamente.",
        data: movimiento,
    });
};

