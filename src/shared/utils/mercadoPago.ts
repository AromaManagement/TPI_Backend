import express, { type Request, type Response } from 'express';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { type ComandaData } from '../../features/comandas/comanda.dto.js';



const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN as string });

export const CreateMPPreference = async (comanda: ComandaData) => {
  try {

    const { detalles } = comanda;

    const preference = new Preference(client);
    
    const result = await preference.create({
      body: {
        items: detalles.map(detalle => ({
          id: `item-ID-${detalle.platoId}`,
          title: `${detalle.platoNombre}`,
          quantity: detalle.cantidad,
          unit_price: Number(detalle.precioUnitario),
          currency_id: 'ARS',
        })),
        back_urls: {
          success: 'localhost:3000/payment-success', // Deep links para volver a tu app
          failure: 'localhost:3000/payment-failure',
          pending: 'localhost:3000/payment-pending'
        },
        auto_return: 'approved',
        notification_url: 'https://tu-dominio-backend.com/webhook/mercadopago'
      }
    });

    // 3. Devolverle al front el init_point (URL de pago) o el ID
    return {
      id: result.id,
      init_point: result.init_point, // URL para producción
      sandbox_init_point: result.sandbox_init_point // URL para testing
    };

  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error);
    throw new Error('No se pudo crear la preferencia de pago');
  }
};
