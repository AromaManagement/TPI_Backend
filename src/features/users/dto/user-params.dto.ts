import { z } from "zod";

export const UserParamsSchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, "El ID de usuario debe ser un número entero positivo"),
});

export type UserParamsDto = z.infer<typeof UserParamsSchema>;
