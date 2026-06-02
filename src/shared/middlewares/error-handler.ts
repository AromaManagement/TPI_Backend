import type { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { AppError } from "../errors/app-error.js";
import type { LogMetadata, ApiErrorResponse } from "../types/index.js";

const logError = (
  err: Error | AppError,
  req: Request,
  statusCode: number,
  isOperational: boolean,
) => {
  const log: LogMetadata = {
    timestamp: new Date().toISOString(),
    level: statusCode >= 500 ? "ERROR" : "WARN",
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip,
    message: err.message,
    statusCode,
    isOperational,
  };

  if (err instanceof AppError && err.errorCode) {
    log.errorCode = err.errorCode;
  }

  // En producción, solo registramos el stack trace para errores críticos (no operacionales / >= 500)
  if (!isOperational || statusCode >= 500) {
    log.stack = err.stack;
  }

  // Usamos console.error serializado para que los colectores de logs (Datadog, AWS CloudWatch, Grafana Loki)
  // puedan parsearlo automáticamente como JSON estructurado.
  console.error(JSON.stringify(log));
};

// Traduce los códigos de error conocidos de Prisma a errores operacionales de HTTP
const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError,
): AppError => {
  switch (err.code) {
    case "P2002": {
      // Conflicto de restricción única (ej. correo duplicado)
      const target = (err.meta?.target as string[])?.join(", ") || "campo";
      return new AppError(
        `Ya existe un registro con el valor ingresado en el campo: (${target})`,
        409,
        "UNIQUE_CONSTRAINT_VIOLATION",
      );
    }
    case "P2025": {
      // Registro no encontrado para actualización/eliminación
      const cause =
        (err.meta?.cause as string) || "El registro solicitado no existe";
      return new AppError(cause, 404, "RECORD_NOT_FOUND");
    }
    case "P2003": {
      // Error de llave foránea (relación inexistente o eliminación impedida)
      const field = (err.meta?.field_name as string) || "relación";
      return new AppError(
        `Error de integridad: El registro relacionado en el campo (${field}) no existe o está siendo utilizado.`,
        400,
        "FOREIGN_KEY_VIOLATION",
      );
    }
    default:
      return new AppError(
        `Error de base de datos (${err.code}): ${err.message}`,
        500,
        "DATABASE_ERROR",
      );
  }
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response<ApiErrorResponse>,
  next: NextFunction,
): void => {
  let error = err;

  // 1. Identificar y mapear errores de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    error = new AppError(
      "Los datos enviados no son válidos para esta consulta.",
      400,
      "VALIDATION_ERROR",
    );
  }

  // 2. Extraer propiedades estándar
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const status = error instanceof AppError ? error.status : "error";
  const isOperational = error instanceof AppError ? error.isOperational : false;
  const errorCode =
    (error instanceof AppError ? error.errorCode : null) ||
    "INTERNAL_SERVER_ERROR";
  const details = error instanceof AppError ? error.details : undefined;

  // 3. Registrar el error de manera estructurada
  logError(error, req, statusCode, isOperational);

  // 4. Responder al cliente
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    res.status(statusCode).json({
      status,
      errorCode,
      message: error.message,
      stack: error.stack,
      error: error,
      details,
    });
  } else {
    // Modo Producción
    if (isOperational) {
      // Errores conocidos y controlados por la aplicación
      res.status(statusCode).json({
        status,
        errorCode,
        message: error.message,
        details,
      });
    } else {
      // Errores inesperados (bugs, fallos de sistema) - No filtran detalles al cliente
      res.status(500).json({
        status: "error",
        errorCode: "INTERNAL_SERVER_ERROR",
        message:
          "Algo salió mal en el servidor. Por favor, inténtelo de nuevo más tarde.",
      });
    }
  }
};
