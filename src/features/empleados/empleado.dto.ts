import { z } from "zod";

export const CreateEmpleadoSchema = z.object({
  personaId: z
    .number({ message: "El ID de persona es requerido" })
    .int("El ID de persona debe ser un número entero")
    .positive("El ID de persona debe ser un número positivo"),
  tipoEmpleadoId: z
    .number({ message: "El ID de tipo de empleado es requerido" })
    .int("El ID de tipo de empleado debe ser un número entero")
    .positive("El ID de tipo de empleado debe ser un número positivo"),
});

export type CreateEmpleadoDto = z.infer<typeof CreateEmpleadoSchema>;

export const UpdateEmpleadoSchema = CreateEmpleadoSchema.partial();

export type UpdateEmpleadoDto = z.infer<typeof UpdateEmpleadoSchema>;

export const EmpleadoParamsSchema = z.object({
  empleadoId: z
    .string()
    .regex(/^\d+$/, "El ID del empleado debe ser un número entero positivo"),
});

export type EmpleadoParamsDto = z.infer<typeof EmpleadoParamsSchema>;
