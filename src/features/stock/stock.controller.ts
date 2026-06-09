import type { Request, Response } from "express";
import {
  createStockService,
  getAllStocksService,
  getStockByIdService,
  updateStockService,
  deleteStockService
} from "./stock.services.js";

export const createStock = async (req: Request, res: Response) => {
  const data = req.body;

  const newStock = await createStockService(data);

  res.status(201).json({
    status: "success",
    message: "Stock creado exitosamente.",
    data: newStock,
  });
};

export const getAllStocks = async (req: Request, res: Response) => {
  const stocks = await getAllStocksService();

  res.status(200).json({
    status: "success",
    message: "Stocks recuperados exitosamente.",
    data: stocks,
  });
};

export const getStockById = async (req: Request, res: Response) => {
  const stockId = parseInt(req.params.stockId as string, 10);
  const stock = await getStockByIdService(stockId);

  res.status(200).json({
    status: "success",
    message: "Stock recuperado exitosamente.",
    data: stock,
  });
};

export const updateStock = async (req : Request, res: Response) => {
  const stockId = parseInt(req.params.stockId as string, 10);
  const data = req.body;
  const updatedStock = await updateStockService(stockId, data);

  res.status(200).json({
    status: "success",
    message: "Stock actualizado exitosamente.",
    data: updatedStock,
  });
};

export const deleteStock = async (req: Request, res: Response) => {
  const stockId = parseInt(req.params.stockId as string, 10);
  const deletedStock = await deleteStockService(stockId);

  res.status(200).json({
    status: "success",
    message: "Stock eliminado exitosamente.",
    data: deletedStock,
  });
};  