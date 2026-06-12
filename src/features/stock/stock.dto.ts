import { z } from "zod";

export const CreateStockSchema = z.object({
    articuloId: z
        .number({ message: "El ID del artículo debe ser un número entero" })
        .int()
        .positive(),
    cantidad: z
        .number({ message: "La cantidad debe ser un número" })
        .nonnegative({ message: "La cantidad inicial no puede ser negativa" }),
    minimo: z
        .number({ message: "El mínimo debe ser un número" })
        .nonnegative({ message: "El mínimo debe ser mayor o igual a cero" })
        .optional()
        .nullable(),
});

export type CreateStockDto = z.infer<typeof CreateStockSchema>;

export const UpdateStockSchema = CreateStockSchema.partial();
export type UpdateStockDto = z.infer<typeof UpdateStockSchema>;

export const StockParamsSchema = z.object({
    stockId: z
        .string()
        .regex(/^\d+$/, "El ID del stock debe ser un número entero positivo"),
});

export type StockParamsDto = z.infer<typeof StockParamsSchema>;
