import { Router } from "express";
import { handleMercadoPagoWebhook } from "./pago.controller.js";

const router = Router();
    

router.use("/mercadopago", handleMercadoPagoWebhook);

export default router;

