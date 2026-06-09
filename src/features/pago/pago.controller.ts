import { Payment } from 'mercadopago';
import { type Request, type Response } from 'express';
import { getPago } from '../../shared/utils/mercadoPago.js';


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

      if (paymentStatus === 'approved') {
        console.log('¡El pago fue aprobado exitosamente!');
      } else {
        console.log(`El pago no está aprobado. Estado actual: ${paymentStatus} (${statusDetail})`);
      }

    } catch (error) {
      console.error('Error al consultar el pago en Mercado Pago:', error);
    }
  }
};