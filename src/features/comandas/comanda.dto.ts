import { z } from "zod";

// Ajustá estos valores según lo que tengas definido en el enum EstadoComanda de tu schema.prisma
const EstadoComandaEnum = z.enum([
  "SIN_ASIGNAR",
  "ASIGNADO",
  "EN_COCINA",
  "LISTO"
]);

export const CreateComandaSchema = z.object({
  clienteId: z
    .number({ message: "El ID del cliente debe ser un número" })
    .int("El ID del cliente debe ser un número entero")
    .positive("El ID del cliente debe ser positivo")
    .optional(),
  estadoComanda: EstadoComandaEnum.optional(),
  fechaSolicitud: z
    .string()
    .datetime({ offset: true, message: "El formato de la fecha de solicitud es inválido" })
    .optional(),
  fechaEntrega: z
    .string()
    .datetime({ offset: true, message: "El formato de la fecha de entrega es inválido" })
    .optional(),
});

export type CreateComandaDto = z.infer<typeof CreateComandaSchema>;

export const UpdateComandaSchema = CreateComandaSchema.partial();

export type UpdateComandaDto = z.infer<typeof UpdateComandaSchema>;

export const ComandaParamsSchema = z.object({
  comandaId: z
    .string({ message: "El ID de la comanda es requerido en los parámetros" })
    .regex(/^\d+$/, "El ID de la comanda debe ser un número entero positivo"),
});

export type ComandaParamsDto = z.infer<typeof ComandaParamsSchema>;