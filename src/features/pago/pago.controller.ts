import { Payment } from 'mercadopago';
import { type Request, type Response } from 'express';
import { getPago } from '../../shared/utils/mercadoPago.js';
import { getPagoByComandaIdService, updateEstadoPagoService } from './pago.service.js';
import { updateComandaEstadoService } from '../comandas/comandas.services.js';


export const handleMercadoPagoWebhook = async (req: Request, res: Response) => {
  res.sendStatus(200);

  const { type, data } = req.body;

  if (type === 'payment' && data && data.id) {
    try {
      const paymentId = data.id; 

      const paymentDetails = await getPago(paymentId);

      const internalOrderId = paymentDetails.external_reference;
      const paymentStatus = paymentDetails.status;
      const statusDetail = paymentDetails.status_detail;
      const totalAmount = paymentDetails.transaction_amount;

      console.log(`Pago MP ${paymentId} -> Orden Interna: ${internalOrderId} | Estado: ${paymentStatus}`);

      if (paymentStatus !== 'approved') {
        console.log(`El pago no está aprobado. Estado actual: ${paymentStatus} (${statusDetail})`);
        return;
      } 

      if (internalOrderId === undefined) {
        console.error('No se encontró external_reference en el pago de Mercado Pago');
        return;
      }

      const comandaId = parseInt(internalOrderId.replace('comanda-', ''), 10);

      const pago = await getPagoByComandaIdService(comandaId);
      if (!pago) {
        console.error('No se encontró el pago asociado a la comanda.');
        return;
      }

      await updateEstadoPagoService(pago.id, 'APROBADO');

      await updateComandaEstadoService(comandaId, 'SIN_ASIGNAR');

      console.log(`Pago ${paymentId} aprobado y comanda ${comandaId} actualizada a SIN_ASIGNAR.`);

    } catch (error) {
      console.error('Error al consultar el pago en Mercado Pago:', error);
    }
  }
};

