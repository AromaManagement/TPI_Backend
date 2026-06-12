import { z } from "zod";

const UnidadMedidaEnum = z.enum(["KG","G", "L","ML", "UNIDAD","PORCIÓN"]);

export const CreateArticuloSchema = z.object({
    nombre: z
        .string({ message: "El nombre es requerido" })
        .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
        .max(100, { message: "El nombre no puede tener más de 100 caracteres" }),
    descripcion: z
        .string()
        .max(200, { message: "La descripción no puede tener más de 200 caracteres" })
        .optional()
        .nullable(),
    unidadMedida: UnidadMedidaEnum.optional().nullable(),
    esIngrediente: z.boolean({ message: "El campo esIngrediente es requerido" })
});

export type CreateArticuloDto = z.infer<typeof CreateArticuloSchema>;

export const UpdateArticuloSchema = CreateArticuloSchema.partial();

export type UpdateArticuloDto = z.infer<typeof UpdateArticuloSchema>;

export const ArticuloParamsSchema = z.object({
    articuloId: z
        .string()
        .regex(/^\d+$/, "El ID del artículo debe ser un número entero positivo"),
});

export type ArticuloParamsDto = z.infer<typeof ArticuloParamsSchema>;   