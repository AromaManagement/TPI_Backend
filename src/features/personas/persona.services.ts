import { prisma } from "../../config/prisma.js";
import type { CreatePersonaDto, UpdatePersonaDto } from "./persona.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const personaSelect = {
  id: true,
  nombre: true,
  apellido: true,
  tipoDocumento: true,
  documento: true,
  nacimiento: true,
  direccionId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  direccion: {
    select: {
      id: true,
      calle: true,
      numeracion: true,
      barrio: true,
      localidad: {
        select: {
          id: true,
          nombre: true,
        },
      },
    },
  },
};

export const createPersonaService = async (data: CreatePersonaDto) => {
  if (data.direccionId) {
    const direccionExists = await prisma.direccion.findUnique({
      where: { id: data.direccionId, deletedAt: null },
    });
    if (!direccionExists) {
      throw new NotFoundError(
        `La dirección con ID ${data.direccionId} no existe.`
      );
    }
  }

  return await prisma.persona.create({
    data,
    select: personaSelect,
  });
};

export const getAllPersonasService = async () => {
  return await prisma.persona.findMany({
    where: { deletedAt: null },
    select: personaSelect,
  });
};

export const getPersonaByIdService = async (id: number) => {
  const persona = await prisma.persona.findUnique({
    where: { id, deletedAt: null },
    select: personaSelect,
  });

  if (!persona) {
    throw new NotFoundError(`La persona con ID ${id} no existe.`);
  }

  return persona;
};

export const updatePersonaService = async (id: number, data: UpdatePersonaDto) => {
  const existingPersona = await prisma.persona.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingPersona) {
    throw new NotFoundError(`La persona con ID ${id} no existe.`);
  }

  if (data.direccionId) {
    const direccionExists = await prisma.direccion.findUnique({
      where: { id: data.direccionId, deletedAt: null },
    });
    if (!direccionExists) {
      throw new NotFoundError(
        `La dirección con ID ${data.direccionId} no existe.`
      );
    }
  }

  return await prisma.persona.update({
    where: { id },
    data,
    select: personaSelect,
  });
};

export const deletePersonaService = async (id: number) => {
  const existingPersona = await prisma.persona.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingPersona) {
    throw new NotFoundError(
      `La persona con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay usuarios activos asociados a esta persona
  const activeUsersCount = await prisma.usuario.count({
    where: { personaId: id, deletedAt: null },
  });

  if (activeUsersCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la persona porque tiene un usuario activo asociado."
    );
  }

  // Verificar si hay empleados activos asociados a esta persona
  const activeEmpleadosCount = await prisma.empleado.count({
    where: { personaId: id, deletedAt: null },
  });

  if (activeEmpleadosCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la persona porque tiene un empleado activo asociado."
    );
  }

  // Verificar si hay clientes activos asociados a esta persona
  const activeClientesCount = await prisma.cliente.count({
    where: { personaId: id, deletedAt: null },
  });

  if (activeClientesCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la persona porque tiene un cliente activo asociado."
    );
  }

  return await prisma.persona.delete({
    where: { id },
    select: personaSelect,
  });
};
