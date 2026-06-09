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


export const getPagoByComandaIdService = async (comandaId: number) => {
    try {
        const pago = await prisma.pago.findFirst({
            where: { comandaId },
        });
        return pago;
    } catch (error) {
        console.error("Error al obtener pago por comandaId:", error);
        throw new Error("Error al obtener pago por comandaId");
    }
};

export const updateEstadoPagoService = async (pagoId: number, estadoPago: string) => {
    try {
        const updatedPago = await prisma.pago.update({
            where: { id: pagoId },
            data: { estadoPago },
        });
        return updatedPago;
    } catch (error) {
        console.error("Error al actualizar estado de pago:", error);
        throw new Error("Error al actualizar estado de pago");
    }
};
