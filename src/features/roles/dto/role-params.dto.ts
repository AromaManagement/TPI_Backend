import { z } from "zod";

export const RoleParamsSchema = z.object({
  roleId: z
    .string()
    .regex(/^\d+$/, "El ID de rol debe ser un número entero positivo"),
});

export type RoleParamsDto = z.infer<typeof RoleParamsSchema>;
