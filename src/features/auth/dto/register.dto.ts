import { z } from "zod";

export const RegisterSchema = z.object({
  correo: z
    .string({ message: "El correo es requerido" })
    .email("El formato del correo es inválido")
    .max(150, "El correo no puede tener más de 150 caracteres"),
  contrasena: z
    .string({ message: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(255, "La contraseña no puede exceder los 255 caracteres"),
  rolId: z
    .number()
    .int()
    .positive()
    .optional(),
  personaId: z
    .number()
    .int()
    .positive()
    .optional(),
  nombre: z
    .string()
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .optional(),
  apellido: z
    .string()
    .max(100, "El apellido no puede tener más de 100 caracteres")
    .optional(),
}).refine(
  (data) =>
    data.personaId !== undefined ||
    (data.nombre !== undefined && data.apellido !== undefined),
  {
    message:
      "Debe proporcionar personaId, o en su defecto nombre y apellido para crear una nueva persona.",
    path: ["personaId"],
  }
);

export type RegisterDto = z.infer<typeof RegisterSchema>;
