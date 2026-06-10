import type { Response, Request } from "express";
import {
    getAllComandasService,
    getComandaByIdService,
    createComandaService,
    getActiveComandasByClienteIdService,
    getCommandasByEstadoService,
    assignRepartidorToComandaService,
    updateComandaEstadoService,
    assignChefToComandaDetalleService,
    completarDetalleService,
    cancelarComandaService,
} from "./comandas.services.js";
import type { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import { CreateComandaSchema, type ComandaData, type CreateComandaDto } from "./comanda.dto.js";
import { getUserByIdService } from "../usuarios/usuario.services.js";
import { CreateMPPreference } from "../../shared/utils/mercadoPago.js";
import type { EstadoComanda, EstadoPago, MetodoPago } from "@prisma/client";
import { createPagoService } from "../pago/pago.service.js";
import type { PagoData } from "../pago/pago.dto.js";

export const createComanda = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (req.user?.rol !== "CLIENTE") {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para crear una comanda.",
            });
        }

        // Get client to get direccionId
        const cliente = await getUserByIdService(req.user.id);
        if (!cliente || !cliente.direccionId) {
            return res.status(404).json({
                status: "error",
                message: "Cliente no encontrado.",
            });
        }

        

        const metodoPago = req.body.metodoPago;
        const comanda = CreateComandaSchema.parse(req.body);
        const estadoComanda = metodoPago === "EFECTIVO" ? "SIN_ASIGNAR" as EstadoComanda : "SIN_PAGAR" as EstadoComanda;

        const comandaData = {
            ...comanda,
            clienteId: req.user.id,
            estadoComanda,
            direccionId: cliente.direccionId,
        };

        const newComanda = await createComandaService(comandaData);

        // Crear pago
        const callbackUrl = req.body.callbackUrl;
        let pago = null as PagoData | null;

        if (metodoPago === "EFECTIVO") {
            pago = {
                comandaId: newComanda.id,
                monto: 0,
                metodoPago: "EFECTIVO" as MetodoPago,
                estadoPago: "ACEPTADO" as EstadoPago,
            }

        } else if (metodoPago === "MERCADOPAGO") {
           // Crear preferencia de pago en MercadoPago
            const comandaMp = {
                id: newComanda.id,
                detalles:  newComanda.detalles.map(detalle => ({
                    platoId: detalle.platoId,
                    platoNombre: 'Plato ' + detalle.platoId,
                    cantidad: 1,
                    precioUnitario: detalle.precioUnitario
                }))
            } as ComandaData;

            const mpPreference = await CreateMPPreference(comandaMp, callbackUrl);

            pago = {
                comandaId: newComanda.id,
                monto: comandaMp.detalles.reduce((total, detalle) => total + (detalle.cantidad * Number(detalle.precioUnitario)), 0),
                metodoPago: "MERCADOPAGO" as MetodoPago,
                estadoPago: "PENDIENTE" as EstadoPago,
                proveedorId: mpPreference.id,
                urlPago: mpPreference.init_point
            }

        } else {
            return res.status(400).json({
                status: "error",
                message: "Método de pago no soportado.",
            });
        }
        
        await createPagoService(pago);

        return res.status(201).json({
            status: "success",
            message: "Comanda creada exitosamente.",
            data: {...newComanda, pago},
        });

    } catch (error) {
        console.error("Error al crear comanda:", error);
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al crear la comanda.",
        });
    }
};


export const getActiveComandaByClienteId = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const clienteId = req.user?.id;
        if (!clienteId) {
            return res.status(401).json({
                status: "error",
                message: "No estás autenticado.",
            });
        }

        const activeComandas = await getActiveComandasByClienteIdService(clienteId);


        return res.status(200).json({
            status: "success",
            data: activeComandas.length > 0 ? activeComandas[0] : null,
        });


    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al obtener las comandas activas.",
        });
    }
};

export const getCommandasByEstado = async (req: Request, res: Response) => {
    try {
        const estado = req.params.estado as string;
        if (!estado) {
            return res.status(400).json({
                status: "error",
                message: "El parámetro 'estado' es requerido.",
            });
        }

        const comandas = await getCommandasByEstadoService(estado);
        return res.status(200).json({
            status: "success",
            data: comandas,
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al obtener las comandas por estado.",
        });
    }
};

export const assignRepartidorToComanda = async (req: AuthenticatedRequest, res: Response) => {
    try {

        const comandaId = Number(req.body.comandaId);
        const repartidorId = req.user?.id;

        if (isNaN(comandaId) || !repartidorId) {
            return res.status(400).json({
                status: "error",
                message: "IDs de comanda o repartidor inválidos.",
            });
        }

        if (req.user?.rol !== "REPARTIDOR") {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para asignarte a una comanda.",
            });
        }

        await assignRepartidorToComandaService(comandaId, repartidorId);

        // Update comanda estado to EN_CAMINO
        const updatedComanda = await updateComandaEstadoService(comandaId, "EN_CAMINO");

        return res.status(200).json({
            status: "success",
            data: updatedComanda,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al asignar el repartidor a la comanda.",
        });
    }
};

export const assignChefToComandaDetalle = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const comandaDetalleId = Number(req.body.detalleComandaId);
        const chefId = req.user?.id;

        if (isNaN(comandaDetalleId) || !chefId) {
            return res.status(400).json({
                status: "error",
                message: "IDs de comanda detalle o chef inválidos.",
            });
        }

        if (req.user?.rol !== "COCINERO") {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para asignarte a un detalle de comanda.",
            });
        }

        const updatedDetalle = await assignChefToComandaDetalleService(comandaDetalleId, chefId);

        return res.status(200).json({
            status: "success",
            message: "Chef asignado al detalle de la comanda exitosamente.",
            data: updatedDetalle,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al asignar el chef al detalle de la comanda.",
        });
    }
};

export const completarDetalle = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const detalleComandaId = Number(req.params.id);

        if (isNaN(detalleComandaId)) {
            return res.status(400).json({
                status: "error",
                message: "ID de detalle de comanda inválido.",
            });
        }

        if (req.user?.rol !== "COCINERO") {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para completar un detalle de comanda.",
            });
        }

        const updatedDetalle = await completarDetalleService(detalleComandaId);

        return res.status(200).json({
            status: "success",
            message: "Detalle de comanda completado exitosamente.",
            data: updatedDetalle,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al completar el detalle de comanda.",
        });
    }
};

export const updateComandaEstado = async (req: Request, res: Response) => {
    try {
        const comandaId = Number(req.params.id);
        const nuevoEstado = req.body.nuevoEstado as string;

        if (isNaN(comandaId) || !nuevoEstado) {
            return res.status(400).json({
                status: "error",
                message: "ID de comanda o nuevo estado inválidos.",
            });
        }

        const updatedComanda = await updateComandaEstadoService(comandaId, nuevoEstado);

        return res.status(200).json({
            status: "success",
            data: updatedComanda,
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al actualizar el estado de la comanda.",
        });
    }
};

export const cancelarComanda = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const comandaId = Number(req.params.id);
        
        if (isNaN(comandaId)) {
            return res.status(400).json({
                status: "error",
                message: "ID de comanda inválido.",
            });
        }

        const comanda = await getComandaByIdService(comandaId);
        if (!comanda) {
            return res.status(404).json({
                status: "error",
                message: "Comanda no encontrada.",
            });
        }

        if (comanda.clienteId !== req.user?.id) {
            return res.status(403).json({
                status: "error",
                message: "No tienes permisos para cancelar esta comanda.",
            });
        }

        const cancelledComanda = await cancelarComandaService(comandaId);

        return res.status(200).json({
            status: "success",
            message: "Comanda cancelada exitosamente.",
            data: cancelledComanda,
        });
        
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al cancelar la comanda.",
        });
    }
};