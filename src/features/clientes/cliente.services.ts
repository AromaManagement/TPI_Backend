import { prisma } from "../../config/prisma.js";
import type { CreateClienteDto, UpdateClienteDto } from "./cliente.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const clienteSelect = {
  id: true,
  personaId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  persona: {
    select: {
      id: true,
      nombre: true,
      apellido: true,
      tipoDocumento: true,
      documento: true,
    },
  },
};

export const createClienteService = async (data: CreateClienteDto) => {
  // Validar existencia de la persona
  const personaExists = await prisma.persona.findUnique({
    where: { id: data.personaId, deletedAt: null },
  });
  if (!personaExists) {
    throw new NotFoundError(`La persona con ID ${data.personaId} no existe.`);
  }

  // Validar que la persona no sea ya un cliente activo
  const alreadyClient = await prisma.cliente.findUnique({
    where: { personaId: data.personaId, deletedAt: null },
  });
  if (alreadyClient) {
    throw new ConflictError(
      `La persona con ID ${data.personaId} ya está registrada como cliente.`
    );
  }

  return await prisma.cliente.create({
    data,
    select: clienteSelect,
  });
};

export const getAllClientesService = async () => {
  return await prisma.cliente.findMany({
    where: { deletedAt: null },
    select: clienteSelect,
  });
};

export const getClienteByIdService = async (id: number) => {
  const cliente = await prisma.cliente.findUnique({
    where: { id, deletedAt: null },
    select: clienteSelect,
  });

  if (!cliente) {
    throw new NotFoundError(`El cliente con ID ${id} no existe.`);
  }

  return cliente;
};

export const updateClienteService = async (
  id: number,
  data: UpdateClienteDto
) => {
  const existingCliente = await prisma.cliente.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingCliente) {
    throw new NotFoundError(`El cliente con ID ${id} no existe.`);
  }

  if (data.personaId) {
    const personaExists = await prisma.persona.findUnique({
      where: { id: data.personaId, deletedAt: null },
    });
    if (!personaExists) {
      throw new NotFoundError(`La persona con ID ${data.personaId} no existe.`);
    }

    if (data.personaId !== existingCliente.personaId) {
      const alreadyClient = await prisma.cliente.findUnique({
        where: { personaId: data.personaId, deletedAt: null },
      });
      if (alreadyClient) {
        throw new ConflictError(
          `La persona con ID ${data.personaId} ya está registrada como cliente.`
        );
      }
    }
  }

  return await prisma.cliente.update({
    where: { id },
    data,
    select: clienteSelect,
  });
};

export const deleteClienteService = async (id: number) => {
  const existingCliente = await prisma.cliente.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingCliente) {
    throw new NotFoundError(
      `El cliente con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay comandas activas asociadas
  const activeComandasCount = await prisma.comanda.count({
    where: { clienteId: id, deletedAt: null },
  });

  if (activeComandasCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el cliente porque tiene comandas activas asociadas."
    );
  }

  return await prisma.cliente.delete({
    where: { id },
    select: clienteSelect,
  });
};
