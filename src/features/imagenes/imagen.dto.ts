import { z } from "zod";

export const CreateImagenSchema = z.object({
  imagenSi: z
    .string({ message: "La URL o ruta de la imagen es requerida" })
    .min(1, "La URL o ruta de la imagen no puede estar vacía"),
});

export type CreateImagenDto = z.infer<typeof CreateImagenSchema>;

export const UpdateImagenSchema = CreateImagenSchema.partial();

export type UpdateImagenDto = z.infer<typeof UpdateImagenSchema>;

export const ImagenParamsSchema = z.object({
  imagenId: z
    .string()
    .regex(/^\d+$/, "El ID de la imagen debe ser un número entero positivo"),
});

export type ImagenParamsDto = z.infer<typeof ImagenParamsSchema>;
