import { z } from "zod";

export const CreatePlatoArticuloSchema = z.object({
  platoId: z
    .number({ message: "El ID del plato es requerido" })
    .int("El ID del plato debe ser un número entero")
    .positive("El ID del plato debe ser un número positivo"),
  articuloId: z
    .number({ message: "El ID del artículo es requerido" })
    .int("El ID del artículo debe ser un número entero")
    .positive("El ID del artículo debe ser un número positivo"),
  cantidad: z.coerce
    .number({ message: "La cantidad es requerida" })
    .positive("La cantidad debe ser un número positivo"),
});

export type CreatePlatoArticuloDto = z.infer<typeof CreatePlatoArticuloSchema>;

export const UpdatePlatoArticuloSchema = CreatePlatoArticuloSchema.pick({
  cantidad: true,
});

export type UpdatePlatoArticuloDto = z.infer<typeof UpdatePlatoArticuloSchema>;

export const PlatoArticuloParamsSchema = z.object({
  platoId: z
    .string()
    .regex(/^\d+$/, "El ID del plato debe ser un número entero positivo"),
  articuloId: z
    .string()
    .regex(/^\d+$/, "El ID del artículo debe ser un número entero positivo"),
});

export type PlatoArticuloParamsDto = z.infer<typeof PlatoArticuloParamsSchema>;
