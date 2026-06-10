import type { Response, Request } from "express";
import type { AuthenticatedRequest } from "../../shared/types/index.js";
import {
  getAllUsersService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
} from "./usuario.services.js";

export const createUser = async (req: Request, res: Response) => {
  const data = req.body;

  const newUser = await createUserService(data);

  res.status(201).json({
    status: "success",
    message: "Usuario creado exitosamente.",
    data: newUser,
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await getAllUsersService();

  res.status(200).json({
    status: "success",
    message: "Usuarios recuperados exitosamente.",
    data: users,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId as string, 10);
  const user = await getUserByIdService(userId);

  res.status(200).json({
    status: "success",
    message: "Usuario recuperado exitosamente.",
    data: user,
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId as string, 10);
  const data = req.body;
  const updatedUser = await updateUserService(userId, data);

  res.status(200).json({
    status: "success",
    message: "Usuario actualizado exitosamente.",
    data: updatedUser,
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId as string, 10);
  const deletedUser = await deleteUserService(userId);

  res.status(200).json({
    status: "success",
    message: "Usuario eliminado exitosamente.",
    data: deletedUser,
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const user = await getUserByIdService(userId);
  res.status(200).json({ status: "success", message: "Perfil obtenido.", data: user });
};

export const updateMe = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const data = req.body;
  const updatedUser = await updateUserService(userId, data);
  res.status(200).json({ status: "success", message: "Perfil actualizado.", data: updatedUser });
};
