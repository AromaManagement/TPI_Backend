import { z } from "zod";

export const CreatePersonaSchema = z.object({
  nombre: z
    .string({ message: "El nombre es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  apellido: z
    .string({ message: "El apellido es requerido" })
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede tener más de 100 caracteres"),
  tipoDocumento: z
    .string()
    .max(50, "El tipo de documento no puede tener más de 50 caracteres")
    .optional()
    .nullable(),
  documento: z
    .string()
    .max(50, "El documento no puede tener más de 50 caracteres")
    .optional()
    .nullable(),
  nacimiento: z.coerce
    .date({ message: "Fecha de nacimiento inválida" })
    .optional()
    .nullable(),
  direccionId: z
    .number()
    .int("El ID de dirección debe ser un número entero")
    .positive("El ID de dirección debe ser un número positivo")
    .optional()
    .nullable(),
});

export type CreatePersonaDto = z.infer<typeof CreatePersonaSchema>;

export const UpdatePersonaSchema = CreatePersonaSchema.partial();

export type UpdatePersonaDto = z.infer<typeof UpdatePersonaSchema>;

export const PersonaParamsSchema = z.object({
  personaId: z
    .string()
    .regex(/^\d+$/, "El ID de persona debe ser un número entero positivo"),
});

export type PersonaParamsDto = z.infer<typeof PersonaParamsSchema>;
