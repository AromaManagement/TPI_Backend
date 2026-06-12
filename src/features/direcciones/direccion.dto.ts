import { z } from "zod";

export const CreateDireccionSchema = z.object({
  barrio: z.string().max(150).optional().nullable(),
  calle: z.string().max(150).optional().nullable(),
  manzanaPiso: z.string().max(50).optional().nullable(),
  numeracion: z.string().max(20).optional().nullable(),
  referencia: z.string().max(255).optional().nullable(),
  casaDepto: z.string().max(50).optional().nullable(),
  localidadId: z.number().int().positive().optional().nullable(),
  lat: z.number().optional().nullable(),
  lng: z.number().optional().nullable(),
  etiqueta: z.string().max(500).optional().nullable(),
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
