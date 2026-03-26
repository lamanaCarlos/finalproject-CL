const Stripe = require('stripe');
const logger = require('../utils/logger');

const supportedEventStatusMap = {
  'payment_intent.succeeded': 'payment_succeeded',
  'payment_intent.payment_failed': 'payment_failed',
  'charge.refunded': 'refunded',
};

const getStripeClient = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    throw new Error('STRIPE_SECRET_KEY no configurada');
  }

  return new Stripe(stripeSecretKey);
};

const getDefaultCurrency = () => process.env.STRIPE_CURRENCY || 'eur';

const mapStripeEventToPaymentStatus = (eventType) => {
  return supportedEventStatusMap[eventType] || null;
};

const toMinorUnitAmount = (amount) => {
  return Math.round(Number(amount) * 100);
};

const createPaymentIntent = async ({ orderId, amount, currency, metadata = {} }) => {
  const stripe = getStripeClient();
  const stripeCurrency = (currency || getDefaultCurrency()).toLowerCase();

  const intent = await stripe.paymentIntents.create({
    amount: toMinorUnitAmount(amount),
    currency: stripeCurrency,
    automatic_payment_methods: { enabled: true },
    metadata: {
      orderId: String(orderId),
      ...metadata,
    },
  });

  return intent;
};

const constructWebhookEvent = (rawBodyBuffer, signatureHeader) => {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET no configurada');
  }

  if (!signatureHeader) {
    throw new Error('Header de firma Stripe ausente');
  }

  return stripe.webhooks.constructEvent(rawBodyBuffer, signatureHeader, webhookSecret);
};

const extractPaymentPayloadFromEvent = (event) => {
  const paymentStatus = mapStripeEventToPaymentStatus(event.type);
  if (!paymentStatus) {
    return null;
  }

  const object = event.data && event.data.object ? event.data.object : {};
  const metadata = object.metadata || {};
  const orderId = metadata.orderId;

  if (!orderId) {
    logger.warn(`Evento Stripe ${event.id} sin orderId en metadata`);
    return null;
  }

  return {
    orderId,
    paymentStatus,
    providerPaymentId: object.id || null,
    webhookEventId: event.id,
    rawEventType: event.type,
  };
};

module.exports = {
  createPaymentIntent,
  constructWebhookEvent,
  mapStripeEventToPaymentStatus,
  extractPaymentPayloadFromEvent,
};

