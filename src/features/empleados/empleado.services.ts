import { prisma } from "../../config/prisma.js";
import type { CreateEmpleadoDto, UpdateEmpleadoDto } from "./empleado.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const empleadoSelect = {
  id: true,
  personaId: true,
  tipoEmpleadoId: true,
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
  tipoEmpleado: {
    select: {
      id: true,
      nombre: true,
    },
  },
};

export const createEmpleadoService = async (data: CreateEmpleadoDto) => {
  // Validar existencia de Persona
  const personaExists = await prisma.persona.findUnique({
    where: { id: data.personaId, deletedAt: null },
  });

  if (!personaExists) {
    throw new NotFoundError(`La persona con ID ${data.personaId} no existe.`);
  }

  // Validar existencia de TipoEmpleado
  const tipoExists = await prisma.tipoEmpleado.findUnique({
    where: { id: data.tipoEmpleadoId, deletedAt: null },
  });

  if (!tipoExists) {
    throw new NotFoundError(
      `El tipo de empleado con ID ${data.tipoEmpleadoId} no existe.`
    );
  }

  // Validar que la persona no sea ya un empleado activo
  const alreadyEmpleado = await prisma.empleado.findUnique({
    where: { personaId: data.personaId, deletedAt: null },
  });

  if (alreadyEmpleado) {
    throw new ConflictError(
      `La persona con ID ${data.personaId} ya está registrada como empleado.`
    );
  }

  return await prisma.empleado.create({
    data,
    select: empleadoSelect,
  });
};

export const getAllEmpleadosService = async () => {
  return await prisma.empleado.findMany({
    where: { deletedAt: null },
    select: empleadoSelect,
  });
};

export const getEmpleadoByIdService = async (id: number) => {
  const empleado = await prisma.empleado.findUnique({
    where: { id, deletedAt: null },
    select: empleadoSelect,
  });

  if (!empleado) {
    throw new NotFoundError(`El empleado con ID ${id} no existe.`);
  }

  return empleado;
};

export const updateEmpleadoService = async (
  id: number,
  data: UpdateEmpleadoDto
) => {
  const existingEmpleado = await prisma.empleado.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingEmpleado) {
    throw new NotFoundError(`El empleado con ID ${id} no existe.`);
  }

  if (data.personaId) {
    const personaExists = await prisma.persona.findUnique({
      where: { id: data.personaId, deletedAt: null },
    });
    if (!personaExists) {
      throw new NotFoundError(`La persona con ID ${data.personaId} no existe.`);
    }

    // Comprobar colisión si cambia el personaId a otra persona que ya sea empleado
    if (data.personaId !== existingEmpleado.personaId) {
      const alreadyEmpleado = await prisma.empleado.findUnique({
        where: { personaId: data.personaId, deletedAt: null },
      });
      if (alreadyEmpleado) {
        throw new ConflictError(
          `La persona con ID ${data.personaId} ya está registrada como empleado.`
        );
      }
    }
  }

  if (data.tipoEmpleadoId) {
    const tipoExists = await prisma.tipoEmpleado.findUnique({
      where: { id: data.tipoEmpleadoId, deletedAt: null },
    });
    if (!tipoExists) {
      throw new NotFoundError(
        `El tipo de empleado con ID ${data.tipoEmpleadoId} no existe.`
      );
    }
  }

  return await prisma.empleado.update({
    where: { id },
    data,
    select: empleadoSelect,
  });
};

export const deleteEmpleadoService = async (id: number) => {
  const existingEmpleado = await prisma.empleado.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingEmpleado) {
    throw new NotFoundError(
      `El empleado con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay comandas asociadas
  const activeComandasCount = await prisma.comanda.count({
    where: { empleadoId: id, deletedAt: null },
  });

  if (activeComandasCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el empleado porque tiene comandas asociadas."
    );
  }

  return await prisma.empleado.delete({
    where: { id },
    select: empleadoSelect,
  });
};
