import { z } from "zod";

const TipoMovEnum = z
    .enum(["INGRESO", "EGRESO", "AJUSTE", "MERMA"]);

export const CreateMovimientoStockSchema = z.object({
    stockId: z
        .number({ message: "El ID del stock debe ser un número entero" })
        .int()
        .positive(),
    cantidad: z
        .number({ message: "La cantidad debe ser un número" })
        .positive({ message: "La cantidad del movimiento debe ser un número positivo mayor a cero" }),
    tipoMov: TipoMovEnum,
    fecha: z
        .string()
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Fecha debe ser una cadena de texto con formato de fecha válido",
        })
        .optional(),
});

export type CreateMovimientoStockDTO = z.infer<typeof CreateMovimientoStockSchema>;
