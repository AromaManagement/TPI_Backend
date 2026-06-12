import { prisma } from "../../config/prisma.js";
import type { CreateMovimientoStockDTO } from "./movimientoStock.dto.js";
import { NotFoundError } from "../../shared/errors/app-error.js";

const movimientoStockSelect = {
  id: true,
  stockId: true,
  cantidad: true,
  tipoMov: true,
  fecha: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createMovimientoService = async (data: CreateMovimientoStockDTO) => {
  // Busca la ficha de stock activa 
  const stockRecord = await prisma.stock.findFirst({
    where: { id: data.stockId, deletedAt: null },
  });

  if (!stockRecord) {
    throw new NotFoundError(
      `No se encontró una ficha de stock activa para el stock con ID ${data.stockId}.`
    );
  }

  // Determina si el movimiento suma o resta stock..
  const esResta = data.tipoMov === "EGRESO" || data.tipoMov === "MERMA";
  const cantidadOperacion = esResta ? -data.cantidad : data.cantidad;

  // 3. Ejecuta ambas operaciones en una transacción atómica (Todo o Nada)
  return await prisma.$transaction(async (tx) => {
    
    // Crear el movimiento de stock
    const nuevoMovimiento = await tx.movimientoStock.create({
      data: {
        stockId: stockRecord.id, 
        tipoMov: data.tipoMov,   
        cantidad: data.cantidad,
        fecha: data.fecha ? new Date(data.fecha) : new Date(),
      },
    });

    // Modificar el stock acumulado de forma segura en la base de datos
    await tx.stock.update({
      where: { id: stockRecord.id },
      data: { 
        cantidad: {
          // Si cantidadOperacion es negativo, Postgres resta automáticamente.
          // Si es positivo, suma de forma segura contra condiciones de carrera.
          increment: cantidadOperacion 
        } 
      },
    });

    return nuevoMovimiento;
  });
};

export const getAllMovimientoStockService = async () => {
  return prisma.movimientoStock.findMany({
    where: { deletedAt: null },
    select: movimientoStockSelect,
    orderBy: { createdAt: "asc" },
  });
};

export const getMovimientoStockByIdService = async (id: number) => {
  const movimientoStock = await prisma.movimientoStock.findUnique({
    where: { id, deletedAt: null },
    select: movimientoStockSelect,
  });

  if (!movimientoStock) {
    throw new NotFoundError(`El movimiento de stock con ID ${id} no existe.`);
  }

  return movimientoStock;
};