import express, { type Request, type Response } from 'express';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { type ComandaData } from '../../features/comandas/comanda.dto.js';



const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });

export const CreateMPPreference = async (comanda: ComandaData, callbackUrl: string) => {
  try {

    const { detalles } = comanda;

    const preference = new Preference(client);

    const totalAmount = detalles.reduce((total, detalle) => {
      return total + Number(detalle.precioUnitario) * detalle.cantidad;
    }, 0);

    const result = await preference.create({
      body: {
        external_reference: `comanda-${comanda.id}`,
        items: [
          {
            id: `comanda-${comanda.id}`,
            title: `Compra en Aromas - Comanda #${comanda.id}`,
            quantity: 1,
            unit_price: totalAmount,
            currency_id: 'ARS',
          }
        ],
        notification_url: `${process.env.WEBHOOK_URL}/api/pago/mercadopago`
      }
    });

    console.log('Preferencia de MercadoPago creada:', result);
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