import type { Response, Request } from "express";
import {
  getAllComandasService,
    getComandaByIdService,
    createComandaService,
    updateComandaService,
    deleteComandaService,
    getActiveComandasByClienteIdService,
} from "./comandas.services.js";
import type { AuthenticatedRequest } from "../../shared/types/auth.types.js";
import { CreateComandaSchema, type CreateComandaDto } from "./comanda.dto.js";
import { getUserByIdService } from "../usuarios/usuario.services.js";

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
        console.log("Comandas activas encontradas:", activeComandas);

        return res.status(200).json({
            status: "success",
            data: activeComandas.length > 0 ? activeComandas[0] : null,
        });


    } catch (error) {
        console.error("Error al obtener las comandas activas:", error);
        return res.status(500).json({
            status: "error",
            message: "Ocurrió un error al obtener las comandas activas.",
        });
    }
};