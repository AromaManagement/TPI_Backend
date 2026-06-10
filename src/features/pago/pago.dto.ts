import type { EstadoPago } from "@prisma/client";

export type PagoData = {
    comandaId: number;
    metodoPago: string;
    monto: number;
    estadoPago: EstadoPago;
    urlPago?: string | null;
    proveedorId?: string | null;
}
