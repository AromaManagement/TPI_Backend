import { z } from "zod";

export const CreateEstadoRecorridoSchema = z.object({
  nombre: z
    .string({ message: "El nombre del estado es requerido" })
    .min(2, "El nombre del estado debe tener al menos 2 caracteres")
    .max(100, "El nombre del estado no puede superar los 100 caracteres"),
  recorridoId: z
    .number()
    .int("El ID del recorrido debe ser un número entero")
    .positive("El ID del recorrido debe ser un número positivo")
    .optional()
    .nullable(),
});

export type CreateEstadoRecorridoDto = z.infer<typeof CreateEstadoRecorridoSchema>;

export const UpdateEstadoRecorridoSchema = CreateEstadoRecorridoSchema.partial();

export type UpdateEstadoRecorridoDto = z.infer<typeof UpdateEstadoRecorridoSchema>;

export const EstadoRecorridoParamsSchema = z.object({
  estadoRecorridoId: z
    .string()
    .regex(/^\d+$/, "El ID del estado del recorrido debe ser un número entero positivo"),
});

export type EstadoRecorridoParamsDto = z.infer<typeof EstadoRecorridoParamsSchema>;
