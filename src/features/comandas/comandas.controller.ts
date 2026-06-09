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
} from "./comandas.services.js";
import type { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import { CreateComandaSchema, type CreateComandaDto } from "./comanda.dto.js";
import { getUserByIdService } from "../usuarios/usuario.services.js";
import { isArray } from "node:util";

export const createComanda = async (req: AuthenticatedRequest, res: Response) => {
    console.log("Intentando crear comanda con datos:", req.body);
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

        const bodyValidado = CreateComandaSchema.parse(req.body);

        const comandaData = {
            ...bodyValidado,
            clienteId: req.user.id,
            estadoComanda: "SIN_ASIGNAR" as const,
            direccionId: cliente.direccionId,
        };

        const newComanda = await createComandaService(comandaData);

        return res.status(201).json({
            status: "success",
            message: "Comanda creada exitosamente.",
            data: newComanda,
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