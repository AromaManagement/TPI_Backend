import express from "express";
import cors from "cors";
import userRouter from "./features/users/user.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import roleRouter from "./features/roles/role.routes.js";
import localidadRouter from "./features/localidades/localidad.routes.js";
import direccionRouter from "./features/direcciones/direccion.routes.js";
import { NotFoundError } from "./shared/errors/app-error.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/roles", roleRouter);
app.use("/api/localidades", localidadRouter);
app.use("/api/direcciones", direccionRouter);

app.all("*", (req, _res, next) => {
  next(
    new NotFoundError(
      `No se puede encontrar ${req.originalUrl} en este servidor.`,
    ),
  );
});

app.use(errorHandler);

export default app;
