import { z } from "zod";

export const CreateComandaAplicacionSchema = z.object({
  comandaId: z
    .number({ message: "El ID de comanda es requerido" })
    .int("El ID de comanda debe ser un número entero")
    .positive("El ID de comanda debe ser un número positivo"),
  direccionId: z
    .number()
    .int("El ID de dirección debe ser un número entero")
    .positive("El ID de dirección debe ser un número positivo")
    .optional()
    .nullable(),
});

export type CreateComandaAplicacionDto = z.infer<typeof CreateComandaAplicacionSchema>;

export const UpdateComandaAplicacionSchema = CreateComandaAplicacionSchema.partial();

export type UpdateComandaAplicacionDto = z.infer<typeof UpdateComandaAplicacionSchema>;

export const ComandaAplicacionParamsSchema = z.object({
  comandaAplicacionId: z
    .string()
    .regex(/^\d+$/, "El ID de la comanda de aplicación debe ser un número entero positivo"),
});

export type ComandaAplicacionParamsDto = z.infer<typeof ComandaAplicacionParamsSchema>;
