import { z } from "zod";

const TipoMovEnum = z
    .enum(["INGRESO", "EGRESO", "AJUSTE", "MERMA"]);

export const CreateMovimientoStockSchema = z.object({
    stockId: z
        .string({ message: "El ID del stock es requerido" })
        .transform((value, ctx) => {
            const parsed = parseInt(value, 10);
            if (isNaN(parsed)) {
                ctx.addIssue({
                    code: z.ZodIssueCode.invalid_type,
                    expected: "number",
                    received: "string",
                    message: "El ID del stock debe ser un número entero válido"
                });
                return z.NEVER;
            }
            return parsed;
        }),
    
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