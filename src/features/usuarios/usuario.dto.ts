import { z } from "zod";

const RolEnum = z.enum(["ADMIN", "CLIENTE", "COCINERO", "REPARTIDOR"]);

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
    .max(100, "El nombre no puede tener más de 100 caracteres"),
  apellido: z
    .string({ message: "El apellido es requerido" })
    .max(100, "El apellido no puede tener más de 100 caracteres"),
  rol: RolEnum.default("CLIENTE"),
  tipoDocumento: z.string().max(50).optional(),
  documento: z.string().max(50).optional(),
  telefono: z.string().max(20).optional(),
  nacimiento: z.string().datetime({ offset: true }).optional(),
  direccionId: z.number().int().positive().optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = CreateUserSchema.partial().extend({
  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(255)
    .optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;

export const UserParamsSchema = z.object({
  userId: z
    .string()
    .regex(/^\d+$/, "El ID de usuario debe ser un número entero positivo"),
});

export type UserParamsDto = z.infer<typeof UserParamsSchema>;
