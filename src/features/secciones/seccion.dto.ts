import { z } from "zod";

export const CreateSeccionSchema = z.object({
  cartaId: z
    .number({ message: "El ID de carta es requerido" })
    .int("El ID de carta debe ser un número entero")
    .positive("El ID de carta debe ser un número positivo"),
  nombre: z
    .string({ message: "El nombre de la sección es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(150, "El nombre no puede tener más de 150 caracteres"),
  detalle: z
    .string()
    .max(500, "El detalle no puede tener más de 500 caracteres")
    .optional()
    .nullable(),
});

export type CreateSeccionDto = z.infer<typeof CreateSeccionSchema>;

export const UpdateSeccionSchema = CreateSeccionSchema.partial();

export type UpdateSeccionDto = z.infer<typeof UpdateSeccionSchema>;

export const SeccionParamsSchema = z.object({
  seccionId: z
    .string()
    .regex(/^\d+$/, "El ID de la sección debe ser un número entero positivo"),
});

export type SeccionParamsDto = z.infer<typeof SeccionParamsSchema>;
