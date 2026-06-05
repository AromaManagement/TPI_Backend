import { z } from "zod";

export const CreateRoleSchema = z.object({
  nombre: z
    .string({ message: "El nombre de rol es requerido" })
    .min(2, "El nombre de rol debe tener al menos 2 caracteres")
    .max(100, "El nombre de rol no puede tener más de 100 caracteres"),
});

export type CreateRoleDto = z.infer<typeof CreateRoleSchema>;
