const { Order, Artwork } = require('../models');
const logger = require('../utils/logger');
const {
  createPaymentIntent,
  constructWebhookEvent,
  extractPaymentPayloadFromEvent,
} = require('../services/payment.service');
const { issueCertificateFromOrder } = require('../services/certificate.service');
const { createNotification } = require('../services/notification.service');

const createIntent = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado',
      });
    }

    if (order.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para pagar este pedido',
      });
    }

    if (order.paymentStatus === 'payment_succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Este pedido ya fue pagado',
      });
    }

    const intent = await createPaymentIntent({
      orderId: order._id.toString(),
      amount: order.price,
      currency: order.paymentCurrency || process.env.STRIPE_CURRENCY || 'eur',
      metadata: {
        buyerId: userId,
        artworkId: order.artworkId.toString(),
      },
    });

    order.paymentStatus = 'payment_pending';
    order.providerPaymentId = intent.id;
    order.paymentProvider = 'stripe';
    order.paymentAmount = order.price;
    order.paymentCurrency = intent.currency;
    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Intento de pago creado',
      data: {
        orderId: order._id,
        clientSecret: intent.client_secret,
        providerPaymentId: intent.id,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    logger.error('Error al crear payment intent:', error);
    return next(error);
  }
};

const stripeWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = constructWebhookEvent(req.body, signature);
    const payload = extractPaymentPayloadFromEvent(event);

    if (!payload) {
      return res.status(200).json({
        success: true,
        message: 'Evento ignorado',
      });
    }

    const order = await Order.findById(payload.orderId);
    if (!order) {
      logger.warn(`Webhook Stripe con orderId inexistente: ${payload.orderId}`);
      return res.status(200).json({
        success: true,
        message: 'Pedido no encontrado, evento ignorado',
      });
    }

    if (order.lastWebhookEventId === payload.webhookEventId) {
      return res.status(200).json({
        success: true,
        message: 'Evento ya procesado',
      });
    }

    order.paymentStatus = payload.paymentStatus;
    order.providerPaymentId = payload.providerPaymentId || order.providerPaymentId;
    order.lastWebhookEventId = payload.webhookEventId;

    if (payload.paymentStatus === 'payment_succeeded') {
      order.paymentConfirmedAt = new Date();
    }

    await order.save();

    if (payload.paymentStatus === 'payment_succeeded') {
      // Confirmar venta solo cuando el pago esté confirmado por webhook
      await Artwork.findByIdAndUpdate(order.artworkId, { status: 'sold' });
      await issueCertificateFromOrder(order);
    }

    await createNotification({
      userId: order.buyerId,
      type: 'payment_status_changed',
      title: 'Actualización de pago',
      message: `Tu pedido ${order._id} cambió a estado ${payload.paymentStatus}`,
      entityType: 'order',
      entityId: order._id,
    });

    await createNotification({
      userId: order.artistId,
      type: 'payment_status_changed',
      title: 'Actualización de venta',
      message: `El pedido ${order._id} cambió a estado ${payload.paymentStatus}`,
      entityType: 'order',
      entityId: order._id,
    });

    logger.info(
      `Webhook Stripe procesado: order=${order._id} event=${payload.rawEventType} status=${payload.paymentStatus}`
    );

    return res.status(200).json({
      success: true,
      message: 'Webhook procesado',
    });
  } catch (error) {
    logger.error('Error al procesar webhook Stripe:', error.message);

    if (error.message.includes('signature') || error.message.includes('STRIPE_WEBHOOK_SECRET')) {
      return res.status(400).json({
        success: false,
        message: 'Webhook inválido',
      });
    }

    return next(error);
  }
};

module.exports = {
  createIntent,
  stripeWebhook,
};

