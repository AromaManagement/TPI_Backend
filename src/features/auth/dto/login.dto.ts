import { z } from "zod";

export const LoginSchema = z.object({
  correo: z
    .string({ message: "El correo es requerido" })
    .email("El formato del correo es inválido")
    .max(150, "El correo no puede tener más de 150 caracteres"),
  contrasena: z
    .string({ message: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(255, "La contraseña no puede exceder los 255 caracteres"),
});

export type LoginDto = z.infer<typeof LoginSchema>;
