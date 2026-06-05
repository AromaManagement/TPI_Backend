import { prisma } from "../../config/prisma.js";
import type { CreateLocalidadDto, UpdateLocalidadDto } from "./localidad.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";

const localidadSelect = {
  id: true,
  nombre: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const createLocalidadService = async (data: CreateLocalidadDto) => {
  const existingLocalidad = await prisma.localidad.findFirst({
    where: { nombre: data.nombre, deletedAt: null },
  });

  if (existingLocalidad) {
    throw new ConflictError(
      `Ya existe una localidad con el nombre '${data.nombre}'.`
    );
  }

  return await prisma.localidad.create({
    data,
    select: localidadSelect,
  });
};

export const getAllLocalidadesService = async () => {
  return await prisma.localidad.findMany({
    where: { deletedAt: null },
    select: localidadSelect,
  });
};

export const getLocalidadByIdService = async (id: number) => {
  const localidad = await prisma.localidad.findUnique({
    where: { id, deletedAt: null },
    select: localidadSelect,
  });

  if (!localidad) {
    throw new NotFoundError(`La localidad con ID ${id} no existe.`);
  }

  return localidad;
};

export const updateLocalidadService = async (
  id: number,
  data: UpdateLocalidadDto
) => {
  const existingLocalidad = await prisma.localidad.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingLocalidad) {
    throw new NotFoundError(`La localidad con ID ${id} no existe.`);
  }

  if (data.nombre) {
    const duplicateLocalidad = await prisma.localidad.findFirst({
      where: { nombre: data.nombre, id: { not: id }, deletedAt: null },
    });
    if (duplicateLocalidad) {
      throw new ConflictError(
        `Ya existe otra localidad con el nombre '${data.nombre}'.`
      );
    }
  }

  return await prisma.localidad.update({
    where: { id },
    data,
    select: localidadSelect,
  });
};

export const deleteLocalidadService = async (id: number) => {
  const existingLocalidad = await prisma.localidad.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingLocalidad) {
    throw new NotFoundError(
      `La localidad con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si hay direcciones activas asociadas a esta localidad
  const activeDireccionesCount = await prisma.direccion.count({
    where: { localidadId: id, deletedAt: null },
  });

  if (activeDireccionesCount > 0) {
    throw new ConflictError(
      "No se puede eliminar la localidad porque tiene direcciones activas asociadas."
    );
  }

  return await prisma.localidad.delete({
    where: { id },
    select: localidadSelect,
  });
};
