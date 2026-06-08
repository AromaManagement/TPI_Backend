import express from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import { load } from "js-yaml";
import swaggerUi from "swagger-ui-express";
import authRouter from "./features/auth/auth.routes.js";
import userRouter from "./features/usuarios/usuario.routes.js";
import localidadRouter from "./features/localidades/localidad.routes.js";
import direccionRouter from "./features/direcciones/direccion.routes.js";
import imagenRouter from "./features/imagenes/imagen.routes.js";
import comandaRouter from "./features/comandas/comandas.routes.js";
import { NotFoundError } from "./shared/errors/app-error.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";

const app = express();
app.use(express.json());
app.use(cors());

const swaggerSpec = load(
  readFileSync(new URL("../openapi.yaml", import.meta.url), "utf8"),
) as object;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/usuarios", userRouter);
app.use("/api/localidades", localidadRouter);
app.use("/api/direcciones", direccionRouter);
app.use("/api/imagenes", imagenRouter);
app.use("/api/comandas", comandaRouter);

app.all(/.*/, (req, _res, next) => {
  next(
    new NotFoundError(
      `No se puede encontrar ${req.originalUrl} en este servidor.`,
    ),
  );
});

app.use(errorHandler);

export default app;
