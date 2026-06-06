import { z } from "zod";

export const CreateCartaSchema = z.object({});

export type CreateCartaDto = z.infer<typeof CreateCartaSchema>;

export const UpdateCartaSchema = z.object({});

export type UpdateCartaDto = z.infer<typeof UpdateCartaSchema>;

export const CartaParamsSchema = z.object({
  cartaId: z
    .string()
    .regex(/^\d+$/, "El ID de la carta debe ser un número entero positivo"),
});

export type CartaParamsDto = z.infer<typeof CartaParamsSchema>;
