import { z } from "zod";

const PlatoArticuloInputSchema = z.object({
  articuloId: z
    .number({ message: "El ID del artículo debe ser un número entero" })
    .int(),
  cantidad: z
    .number({ message: "La cantidad debe ser un número" })
    .positive({ message: "La cantidad debe ser un número positivo mayor a cero" }),
});

export const CreatePlatoSchema = z.object({
  seccionId: z
    .number({ message: "El ID de sección debe ser un número entero" })
    .int(),
  nombre: z
    .string({ message: "El nombre del plato es requerido" })
    .min(1, "El nombre no puede estar vacío")
    .max(150, "El nombre no puede superar los 150 caracteres"),
  precio: z
    .number({ message: "El precio debe ser un número" })
    .positive({ message: "El precio debe ser un número positivo" }),
  detalle: z
    .string()
    .max(500, "El detalle no puede superar los 500 caracteres")
    .optional()
    .nullable(),
  imagenId: z
    .number()
    .int()
    .optional()
    .nullable(),
  articulos: z
    .array(PlatoArticuloInputSchema)
    .optional()
    .default([]),
});

export type CreatePlatoDto = z.infer<typeof CreatePlatoSchema>;

export const PlatosParamsSchema = z.object({
  platoId: z
    .string()
    .regex(/^\d+$/, "El ID del plato debe ser un número entero positivo"),
});

export type PlatosParamsDto = z.infer<typeof PlatosParamsSchema>;

export const UpdatePlatoSchema = CreatePlatoSchema.partial();

export type UpdatePlatoDto = z.infer<typeof UpdatePlatoSchema>; 
