import express from "express";
import cors from "cors";
import { readFileSync } from "node:fs";
import { load } from "js-yaml";
import swaggerUi from "swagger-ui-express";
import authRouter from "./features/auth/auth.routes.js";
import userRouter from "./features/usuarios/usuario.routes.js";
import direccionRouter from "./features/direcciones/direccion.routes.js";
import imagenRouter from "./features/imagenes/imagen.routes.js";
import comandaRouter from "./features/comandas/comandas.routes.js";
import articuloRouter from "./features/articulo/articulo.routes.js";
import stockRouter from "./features/stock/stock.routes.js";
import movimientoStockRouter from "./features/movimientoStock/movimientoStock.routes.js";
import platoRouter from "./features/plato/plato.routes.js";
import seccionRouter from "./features/secciones/secciones.router.js";
import cartaRouter from "./features/carta/carta.routes.js";
import pagoRouter from "./features/pago/pago.route.js";
import { NotFoundError } from "./shared/errors/app-error.js";
import { errorHandler } from "./shared/middlewares/error-handler.js";

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    const color = res.statusCode >= 500 ? "\x1b[31m" : res.statusCode >= 400 ? "\x1b[33m" : "\x1b[32m";
    console.log(`${color}${req.method}\x1b[0m ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

const swaggerSpec = load(
  readFileSync(new URL("../openapi.yaml", import.meta.url), "utf8"),
) as object;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRouter);
app.use("/api/usuarios", userRouter);
app.use("/api/direcciones", direccionRouter);
app.use("/api/imagenes", imagenRouter);
app.use("/api/comandas", comandaRouter);
app.use("/api/articulo", articuloRouter);
app.use("/api/stock", stockRouter);
app.use("/api/movimiento-stock", movimientoStockRouter);
app.use("/api/platos", platoRouter);
app.use("/api/secciones", seccionRouter);
app.use("/api/carta", cartaRouter);
app.use("/api/pago", pagoRouter);

app.all(/.*/, (req, _res, next) => {
  next(
    new NotFoundError(
      `No se puede encontrar ${req.originalUrl} en este servidor.`,
    ),
  );
});

app.use(errorHandler);

export default app;
