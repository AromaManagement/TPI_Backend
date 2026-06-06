import { z } from "zod";
import { EstadoRecorrido } from "@prisma/client";

export const CreateRecorridoSchema = z.object({
  comandaAplicacionId: z
    .number()
    .int("El ID de comanda de aplicación debe ser un número entero")
    .positive("El ID de comanda de aplicación debe ser un número positivo")
    .optional()
    .nullable(),
  empleadoId: z
    .number()
    .int("El ID del empleado debe ser un número entero")
    .positive("El ID del empleado debe ser un número positivo")
    .optional()
    .nullable(),
  estado: z.nativeEnum(EstadoRecorrido).optional().nullable(),
  fechaFin: z.coerce
    .date({ message: "Fecha de fin inválida" })
    .optional()
    .nullable(),
  fechaIn: z.coerce
    .date({ message: "Fecha de inicio inválida" })
    .optional()
    .nullable(),
  coordIn: z
    .string()
    .max(100, "Las coordenadas de inicio no pueden superar los 100 caracteres")
    .optional()
    .nullable(),
  coordFin: z
    .string()
    .max(100, "Las coordenadas de fin no pueden superar los 100 caracteres")
    .optional()
    .nullable(),
});

export type CreateRecorridoDto = z.infer<typeof CreateRecorridoSchema>;

export const UpdateRecorridoSchema = CreateRecorridoSchema.partial();

export type UpdateRecorridoDto = z.infer<typeof UpdateRecorridoSchema>;

export const RecorridoParamsSchema = z.object({
  recorridoId: z
    .string()
    .regex(/^\d+$/, "El ID del recorrido debe ser un número entero positivo"),
});

export type RecorridoParamsDto = z.infer<typeof RecorridoParamsSchema>;
