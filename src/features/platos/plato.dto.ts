import { z } from "zod";

export const CreatePlatoSchema = z.object({
  seccionId: z
    .number({ message: "El ID de sección es requerido" })
    .int("El ID de sección debe ser un número entero")
    .positive("El ID de sección debe ser un número positivo"),
  nombre: z
    .string()
    .min(2, "El nombre del plato debe tener al menos 2 caracteres")
    .max(150, "El nombre del plato no puede tener más de 150 caracteres")
    .optional()
    .nullable(),
  precio: z.coerce
    .number()
    .positive("El precio debe ser un número positivo")
    .optional()
    .nullable(),
  detalle: z
    .string()
    .max(1000, "El detalle del plato no puede tener más de 1000 caracteres")
    .optional()
    .nullable(),
  imagenId: z
    .number()
    .int("El ID de imagen debe ser un número entero")
    .positive("El ID de imagen debe ser un número positivo")
    .optional()
    .nullable(),
});

export type CreatePlatoDto = z.infer<typeof CreatePlatoSchema>;

export const UpdatePlatoSchema = CreatePlatoSchema.partial();

export type UpdatePlatoDto = z.infer<typeof UpdatePlatoSchema>;

export const PlatoParamsSchema = z.object({
  platoId: z
    .string()
    .regex(/^\d+$/, "El ID del plato debe ser un número entero positivo"),
});

export type PlatoParamsDto = z.infer<typeof PlatoParamsSchema>;
