import type { Request, Response } from "express";
import {
  createRoleService,
  getAllRolesService,
  getRoleByIdService,
  updateRoleService,
  deleteRoleService,
} from "./rol.services.js";

export const createRole = async (req: Request, res: Response) => {
  const data = req.body;
  const newRole = await createRoleService(data);

  res.status(201).json({
    status: "success",
    message: "Rol creado exitosamente.",
    data: newRole,
  });
};

export const getAllRoles = async (req: Request, res: Response) => {
  const roles = await getAllRolesService();

  res.status(200).json({
    status: "success",
    message: "Roles recuperados exitosamente.",
    data: roles,
  });
};

export const getRoleById = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId as string, 10);
  const role = await getRoleByIdService(roleId);

  res.status(200).json({
    status: "success",
    message: "Rol recuperado exitosamente.",
    data: role,
  });
};

export const updateRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId as string, 10);
  const data = req.body;
  const updatedRole = await updateRoleService(roleId, data);

  res.status(200).json({
    status: "success",
    message: "Rol actualizado exitosamente.",
    data: updatedRole,
  });
};

export const deleteRole = async (req: Request, res: Response) => {
  const roleId = parseInt(req.params.roleId as string, 10);
  const deletedRole = await deleteRoleService(roleId);

  res.status(200).json({
    status: "success",
    message: "Rol eliminado exitosamente.",
    data: deletedRole,
  });
};
