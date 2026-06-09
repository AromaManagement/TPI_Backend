import express, { type Request, type Response } from 'express';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { type ComandaData } from '../../features/comandas/comanda.dto.js';



const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });

export const CreateMPPreference = async (comanda: ComandaData, callbackUrl: string) => {
  try {

    const { detalles } = comanda;

    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        external_reference: `comanda-${comanda.id}`,
        items: detalles.map(detalle => ({
          id: `item-ID-${detalle.platoId}`,
          title: `${detalle.platoNombre}`,
          quantity: detalle.cantidad,
          unit_price: Number(detalle.precioUnitario),
          currency_id: 'ARS',
        })),
        back_urls: {
          success: `${callbackUrl}?status=success`, 
          failure: `${callbackUrl}?status=failure`,
          pending: `${callbackUrl}?status=pending`
        },
        auto_return: 'approved',
        notification_url: `${process.env.WEBHOOK_URL}/api/pago/mercadopago`
      }
    });

    return {
      id: result.id,
      init_point: result.init_point, 
      sandbox_init_point: result.sandbox_init_point 
    };

  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error);
    throw new Error('No se pudo crear la preferencia de pago');
  }
};


export const getPago = async (id: string) => {
  try {
    const payment = new Payment(client);
    const paymentDetails = await payment.get({ id });

    return paymentDetails;
  } catch (error) {
    console.error('Error obteniendo el pago de MercadoPago:', error);
    throw new Error('No se pudo obtener el pago');
  }
};