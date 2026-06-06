import { z } from "zod";

export const CreateClienteSchema = z.object({
  personaId: z
    .number({ message: "El ID de persona es requerido" })
    .int("El ID de persona debe ser un número entero")
    .positive("El ID de persona debe ser un número positivo"),
});

export type CreateClienteDto = z.infer<typeof CreateClienteSchema>;

export const UpdateClienteSchema = CreateClienteSchema.partial();

export type UpdateClienteDto = z.infer<typeof UpdateClienteSchema>;

export const ClienteParamsSchema = z.object({
  clienteId: z
    .string()
    .regex(/^\d+$/, "El ID del cliente debe ser un número entero positivo"),
});

export type ClienteParamsDto = z.infer<typeof ClienteParamsSchema>;
