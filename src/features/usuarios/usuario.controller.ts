import type { Response, Request } from "express";
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

  const { contrasena, ...userWithoutPassword } = newUser;

  res.status(201).json({
    status: "success",
    message: "Usuario creado exitosamente.",
    data: userWithoutPassword,
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
