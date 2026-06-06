import { z } from "zod";

export const CreateTipoEmpleadoSchema = z.object({
  nombre: z
    .string({ message: "El nombre del tipo de empleado es requerido" })
    .min(2, "El nombre del tipo de empleado debe tener al menos 2 caracteres")
    .max(100, "El nombre del tipo de empleado no puede tener más de 100 caracteres"),
});

export type CreateTipoEmpleadoDto = z.infer<typeof CreateTipoEmpleadoSchema>;

export const UpdateTipoEmpleadoSchema = CreateTipoEmpleadoSchema.partial();

export type UpdateTipoEmpleadoDto = z.infer<typeof UpdateTipoEmpleadoSchema>;

export const TipoEmpleadoParamsSchema = z.object({
  tipoEmpleadoId: z
    .string()
    .regex(/^\d+$/, "El ID del tipo de empleado debe ser un número entero positivo"),
});

export type TipoEmpleadoParamsDto = z.infer<typeof TipoEmpleadoParamsSchema>;
