import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodSchema } from "zod";
import { BadRequestError } from "../errors/app-error.js";

export const validateBody = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationDetails = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        next(
          new BadRequestError(
            "Los datos de entrada no son válidos.",
            "VALIDATION_FAILED",
            validationDetails
          )
        );
      } else {
        next(error);
      }
    }
  };
};

export const validateParams = (schema: ZodSchema) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      // parseAsync valida y tipa req.params
      req.params = (await schema.parseAsync(req.params)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationDetails = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        next(
          new BadRequestError(
            "Los parámetros de la ruta no son válidos.",
            "VALIDATION_FAILED",
            validationDetails
          )
        );
      } else {
        next(error);
      }
    }
  };
};
