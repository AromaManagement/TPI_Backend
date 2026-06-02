import { z } from "zod";

export const CreateUserSchema = z.object({
  correo: z
    .string({ message: "El correo es requerido" })
    .email("El formato del correo es inválido")
    .max(150, "El correo no puede tener más de 150 caracteres"),
  contrasena: z
    .string({ message: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(255, "La contraseña no puede exceder los 255 caracteres"),
  rolId: z
    .number({ message: "El ID de rol es requerido" })
    .int("El ID de rol debe ser un número entero")
    .positive("El ID de rol debe ser un número positivo"),
  personaId: z
    .number({ message: "El ID de persona es requerido" })
    .int("El ID de persona debe ser un número entero")
    .positive("El ID de persona debe ser un número positivo"),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
