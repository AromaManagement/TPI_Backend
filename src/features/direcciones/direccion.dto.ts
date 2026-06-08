import { z } from "zod";

export const CreateDireccionSchema = z.object({
  barrio: z
    .string()
    .max(150, "El barrio no puede tener más de 150 caracteres")
    .optional()
    .nullable(),
  calle: z
    .string()
    .max(150, "La calle no puede tener más de 150 caracteres")
    .optional()
    .nullable(),
  manzanaPiso: z
    .string()
    .max(50, "La manzana o piso no puede tener más de 50 caracteres")
    .optional()
    .nullable(),
  numeracion: z
    .string()
    .max(20, "La numeración no puede tener más de 20 caracteres")
    .optional()
    .nullable(),
  referencia: z
    .string()
    .max(255, "La referencia no puede tener más de 255 caracteres")
    .optional()
    .nullable(),
  casaDepto: z
    .string()
    .max(50, "La casa o departamento no puede tener más de 50 caracteres")
    .optional()
    .nullable(),
  localidadId: z
    .number({ message: "El ID de localidad es requerido" })
    .int("El ID de localidad debe ser un número entero")
    .positive("El ID de localidad debe ser un número positivo"),
});

export type CreateDireccionDto = z.infer<typeof CreateDireccionSchema>;

export const UpdateDireccionSchema = CreateDireccionSchema.partial();

export type UpdateDireccionDto = z.infer<typeof UpdateDireccionSchema>;

export const DireccionParamsSchema = z.object({
  direccionId: z
    .string()
    .regex(/^\d+$/, "El ID de la dirección debe ser un número entero positivo"),
});

export type DireccionParamsDto = z.infer<typeof DireccionParamsSchema>;
