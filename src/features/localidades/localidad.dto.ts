import { z } from "zod";

export const CreateLocalidadSchema = z.object({
  nombre: z
    .string({ message: "El nombre de la localidad es requerido" })
    .min(2, "El nombre de la localidad debe tener al menos 2 caracteres")
    .max(150, "El nombre de la localidad no puede tener más de 150 caracteres"),
});

export type CreateLocalidadDto = z.infer<typeof CreateLocalidadSchema>;

export const UpdateLocalidadSchema = CreateLocalidadSchema.partial();

export type UpdateLocalidadDto = z.infer<typeof UpdateLocalidadSchema>;

export const LocalidadParamsSchema = z.object({
  localidadId: z
    .string()
    .regex(/^\d+$/, "El ID de la localidad debe ser un número entero positivo"),
});

export type LocalidadParamsDto = z.infer<typeof LocalidadParamsSchema>;
