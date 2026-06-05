import express from "express";
import cors from "cors";
import userRouter from "./features/users/user.routes.js";
import authRouter from "./features/auth/auth.routes.js";
import { NotFoundError } from "./shared/errors/app-error.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.all("*", (req, _res, next) => {
  next(
    new NotFoundError(
      `No se puede encontrar ${req.originalUrl} en este servidor.`,
    ),
  );
});

app.use(errorHandler);

export default app;
