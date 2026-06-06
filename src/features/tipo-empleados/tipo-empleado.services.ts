import { prisma } from "../../config/prisma.js";
import type {
  CreateTipoEmpleadoDto,
  UpdateTipoEmpleadoDto,
} from "./tipo-empleado.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const tipoEmpleadoSelect = {
  id: true,
  nombre: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createTipoEmpleadoService = async (
  data: CreateTipoEmpleadoDto
) => {
  const existingTipo = await prisma.tipoEmpleado.findFirst({
    where: { nombre: data.nombre, deletedAt: null },
  });

  if (existingTipo) {
    throw new ConflictError(
      `Ya existe un tipo de empleado con el nombre '${data.nombre}'.`
    );
  }

  return await prisma.tipoEmpleado.create({
    data,
    select: tipoEmpleadoSelect,
  });
};

export const getAllTipoEmpleadosService = async () => {
  return await prisma.tipoEmpleado.findMany({
    where: { deletedAt: null },
    select: tipoEmpleadoSelect,
  });
};

export const getTipoEmpleadoByIdService = async (id: number) => {
  const tipo = await prisma.tipoEmpleado.findUnique({
    where: { id, deletedAt: null },
    select: tipoEmpleadoSelect,
  });

  if (!tipo) {
    throw new NotFoundError(`El tipo de empleado con ID ${id} no existe.`);
  }

  return tipo;
};

export const updateTipoEmpleadoService = async (
  id: number,
  data: UpdateTipoEmpleadoDto
) => {
  const existingTipo = await prisma.tipoEmpleado.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingTipo) {
    throw new NotFoundError(`El tipo de empleado con ID ${id} no existe.`);
  }

  if (data.nombre) {
    const duplicate = await prisma.tipoEmpleado.findFirst({
      where: { nombre: data.nombre, id: { not: id }, deletedAt: null },
    });
    if (duplicate) {
      throw new ConflictError(
        `Ya existe otro tipo de empleado con el nombre '${data.nombre}'.`
      );
    }
  }

  return await prisma.tipoEmpleado.update({
    where: { id },
    data,
    select: tipoEmpleadoSelect,
  });
};

export const deleteTipoEmpleadoService = async (id: number) => {
  const existingTipo = await prisma.tipoEmpleado.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingTipo) {
    throw new NotFoundError(
      `El tipo de empleado con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay empleados asociados activos
  const activeEmpleadosCount = await prisma.empleado.count({
    where: { tipoEmpleadoId: id, deletedAt: null },
  });

  if (activeEmpleadosCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el tipo de empleado porque está asociado a empleados activos."
    );
  }

  return await prisma.tipoEmpleado.delete({
    where: { id },
    select: tipoEmpleadoSelect,
  });
};
