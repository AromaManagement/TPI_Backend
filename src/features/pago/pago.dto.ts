import type { EstadoPago } from "@prisma/client";

export type PagoData = {
    comandaId: number;
    metodoPago: string;
    monto: number;
    estadoPago: EstadoPago;
    provedorId?: string; // ID del pago en el proveedor (ej. MercadoPago)
}
