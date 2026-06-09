import { z } from "zod";

export const CreateStockSchema = z.object({
    articuloId: z
        .string({ message: "El ID del artículo es requerido" })
        .transform((value, ctx) => {
            const parsed = parseInt(value, 10);
            if (isNaN(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    expected: "number",
                    received: "string",
                    message: "El ID del artículo debe ser un número entero válido"
                });
                return z.NEVER;
            }
            return parsed;
        }),
    cantidad: z
        .number({ message: "La cantidad debe ser un número" })
        .nonnegative({ message: "La cantidad inicial no puede ser negativa" }),
    minimo: z 
        .number({ message: "El mínimo debe ser un número" })
        .positive({ message: "El mínimo debe ser un número positivo" }),
});

export type CreateStockDto = z.infer<typeof CreateStockSchema>;

// Permite actualizaciones parciales (ej. modificar solo el stock mínimo)
export const UpdateStockSchema = CreateStockSchema.partial();
export type UpdateStockDto = z.infer<typeof UpdateStockSchema>;

// Valida el ID que viaja por la URL en las rutas de consulta o edición del stock maestro
export const StockParamsSchema = z.object({
    stockId: z
        .string()
        .regex(/^\d+$/, "El ID del stock debe ser un número entero positivo"),
});

export type StockParamsDto = z.infer<typeof StockParamsSchema>;