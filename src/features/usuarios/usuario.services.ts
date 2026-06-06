import { prisma } from "../../config/prisma.js";
import type { CreateUserDto, UpdateUserDto } from "./usuario.dto.js";
import { NotFoundError, ConflictError } from "../../shared/errors/app-error.js";
import bcrypt from "bcrypt";

const userSelect = {
  id: true,
  correo: true,
  nombre: true,
  apellido: true,
  tipoDocumento: true,
  documento: true,
  nacimiento: true,
  direccionId: true,
  rol: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  direccion: {
    select: {
      id: true,
      calle: true,
      numeracion: true,
      barrio: true,
    },
  },
};

export const createUserService = async (data: CreateUserDto) => {
  // Validar existencia de la dirección si se provee
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

  // Validar si el correo ya existe
  const emailExists = await prisma.usuario.findUnique({
    where: { correo: data.correo, deletedAt: null },
  });
  if (emailExists) {
    throw new ConflictError(
      `El correo '${data.correo}' ya se encuentra registrado.`
    );
  }

  const hashedPassword = await bcrypt.hash(data.contrasena, 10);

  return await prisma.usuario.create({
    data: {
      ...data,
      contrasena: hashedPassword,
    },
    select: userSelect,
  });
};

export const getAllUsersService = async () => {
  return await prisma.usuario.findMany({
    where: { deletedAt: null },
    select: userSelect,
  });
};

export const getUserByIdService = async (id: number) => {
  const user = await prisma.usuario.findUnique({
    where: { id, deletedAt: null },
    select: userSelect,
  });

  if (!user) {
    throw new NotFoundError(`El usuario con ID ${id} no existe.`);
  }

  return user;
};

export const updateUserService = async (id: number, data: UpdateUserDto) => {
  const existingUser = await prisma.usuario.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingUser) {
    throw new NotFoundError(`El usuario con ID ${id} no existe.`);
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

  if (data.correo && data.correo !== existingUser.correo) {
    const emailExists = await prisma.usuario.findUnique({
      where: { correo: data.correo, deletedAt: null },
    });
    if (emailExists) {
      throw new ConflictError(
        `El correo '${data.correo}' ya se encuentra registrado por otro usuario.`
      );
    }
  }

  const updateData = { ...data };

  if (updateData.contrasena) {
    updateData.contrasena = await bcrypt.hash(updateData.contrasena, 10);
  }

  return await prisma.usuario.update({
    where: { id },
    data: updateData,
    select: userSelect,
  });
};

export const deleteUserService = async (id: number) => {
  const existingUser = await prisma.usuario.findUnique({
    where: { id, deletedAt: null },
  });

  if (!existingUser) {
    throw new NotFoundError(
      `El usuario con ID ${id} no existe y no se puede eliminar.`
    );
  }

  // Verificar si tiene comandas activas asociadas como cliente
  const activeComandasCount = await prisma.comanda.count({
    where: { clienteId: id, deletedAt: null },
  });
  if (activeComandasCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el usuario porque tiene comandas activas como cliente."
    );
  }

  // Verificar si tiene detalles de comanda activos asociados como empleado
  const activeDetallesCount = await prisma.detalleComanda.count({
    where: { empleadoId: id, deletedAt: null },
  });
  if (activeDetallesCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el usuario porque tiene detalles de comanda activos asignados como empleado."
    );
  }

  // Verificar si tiene recorridos activos asociados como empleado
  const activeRecorridosCount = await prisma.recorrido.count({
    where: { empleadoId: id, deletedAt: null },
  });
  if (activeRecorridosCount > 0) {
    throw new ConflictError(
      "No se puede eliminar el usuario porque tiene recorridos activos asignados como empleado."
    );
  }

  return await prisma.usuario.delete({
    where: { id },
    select: userSelect,
  });
};
