import { prisma } from "../../config/prisma.js";
import type { PagoData } from "./pago.dto.js";



export const createPagoService = async (pagoData: PagoData) => {
    try {
        const newPago = await prisma.pago.create({
            data: pagoData,
        });
        return newPago;
    } catch (error) {
        console.error("Error al crear pago:", error);
        throw new Error("Error al crear pago");
    }
};

