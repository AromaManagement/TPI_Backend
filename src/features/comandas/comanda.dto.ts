import type { Decimal } from "@prisma/client/runtime/library";
import { dir } from "node:console";
import { z } from "zod";

// Ajustá estos valores según lo que tengas definido en el enum EstadoComanda de tu schema.prisma
const EstadoComandaEnum = z.enum([
  "SIN_ASIGNAR",
  "EN_COCINA",
  "LISTO",
  "EN_CAMINO",
  "ENTREGADO",
  "CANCELADO"
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
  direccionId: z
    .number({ message: "El ID de la dirección debe ser un número" })
    .int("El ID de la dirección debe ser un número entero")
    .positive("El ID de la dirección debe ser positivo")
    .optional(),
  detalles: z.array(
    z.object({
        platoId: z
            .number({ message: "El ID del plato debe ser un número" })
            .int("El ID del plato debe ser un número entero")
            .positive("El ID del plato debe ser positivo"),
        cantidad: z
            .number({ message: "La cantidad debe ser un número" })
            .int("La cantidad debe ser un número entero")
            .positive("La cantidad debe ser positiva"),
        precioUnitario: z
            .number({ message: "El precio unitario debe ser un número" })
            .min(0, "El precio unitario debe ser positivo")
            .optional(),
    })
  ),
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

export type ComandaData = {
  id: number;

  detalles: {
    platoId: number;
    platoNombre: string;
    cantidad: number;
    precioUnitario?: Decimal;
  }[];
};