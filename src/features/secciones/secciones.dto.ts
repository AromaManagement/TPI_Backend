import { z } from "zod";

export const CreateSeccionSchema = z.object({
  nombre: z
    .string({ message: "El nombre de la sección es requerido" })
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  cartaId: z
    .number({ message: "El ID de la carta es requerido" })
    .int("El ID de la carta debe ser un número entero")
    .positive("El ID de la carta debe ser un número positivo"),
  detalle: z
    .string()
    .max(500, "El detalle no puede superar los 500 caracteres")
    .optional()
    .nullable(),
}); 

export type CreateSeccionDto = z.infer<typeof CreateSeccionSchema>;

export const SeccionParamsSchema = z.object({
  seccionId: z
    .string()
    .regex(/^\d+$/, "El ID de la sección debe ser un número entero positivo"),
});

export type SeccionParamsDto = z.infer<typeof SeccionParamsSchema>;

export const UpdateSeccionSchema = CreateSeccionSchema.partial();

export type UpdateSeccionDto = z.infer<typeof UpdateSeccionSchema>; 