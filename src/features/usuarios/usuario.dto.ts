import { z } from "zod";
import { Rol } from "@prisma/client";

export const CreateUserSchema = z.object({
  correo: z
    .string({ message: "El correo es requerido" })
    .email("El formato del correo es inválido")
    .max(150, "El correo no puede tener más de 150 caracteres"),
  contrasena: z
    .string({ message: "La contraseña es requerida" })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(255, "La contraseña no puede exceder los 255 caracteres"),
  nombre: z
    .string({ message: "El nombre es requerido" })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  apellido: z
    .string({ message: "El apellido es requerido" })
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido no puede tener más de 100 caracteres"),
  tipoDocumento: z
    .string()
    .max(50, "El tipo de documento no puede tener más de 50 caracteres")
    .optional()
    .nullable(),
  documento: z
    .string()
    .max(50, "El documento no puede tener más de 50 caracteres")
    .optional()
    .nullable(),
  nacimiento: z.coerce
    .date({ message: "Fecha de nacimiento inválida" })
    .optional()
    .nullable(),
  direccionId: z
    .number()
    .int("El ID de dirección debe ser un número entero")
    .positive("El ID de dirección debe ser un número positivo")
    .optional()
    .nullable(),
  rol: z.nativeEnum(Rol, { message: "El rol es requerido y debe ser un rol válido" }),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial();

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export const UserParamsSchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, "El ID de usuario debe ser un número entero positivo"),
});

export type UserParamsDto = z.infer<typeof UserParamsSchema>;
