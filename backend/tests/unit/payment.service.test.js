const test = require('node:test');
const assert = require('node:assert/strict');

const {
  mapStripeEventToPaymentStatus,
  extractPaymentPayloadFromEvent,
} = require('../../src/services/payment.service');

test('mapStripeEventToPaymentStatus maps supported events', () => {
  assert.equal(mapStripeEventToPaymentStatus('payment_intent.succeeded'), 'payment_succeeded');
  assert.equal(mapStripeEventToPaymentStatus('payment_intent.payment_failed'), 'payment_failed');
  assert.equal(mapStripeEventToPaymentStatus('charge.refunded'), 'refunded');
});

test('mapStripeEventToPaymentStatus returns null for unsupported events', () => {
  assert.equal(mapStripeEventToPaymentStatus('invoice.created'), null);
});

test('extractPaymentPayloadFromEvent returns payload for valid event', () => {
  const event = {
    id: 'evt_123',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_123',
        metadata: {
          orderId: '65e7e7e7e7e7e7e7e7e7e7e7',
        },
      },
    },
  };

  const payload = extractPaymentPayloadFromEvent(event);
  assert.equal(payload.orderId, '65e7e7e7e7e7e7e7e7e7e7e7');
  assert.equal(payload.paymentStatus, 'payment_succeeded');
  assert.equal(payload.providerPaymentId, 'pi_123');
  assert.equal(payload.webhookEventId, 'evt_123');
});

test('extractPaymentPayloadFromEvent returns null when orderId is missing', () => {
  const event = {
    id: 'evt_123',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_123',
        metadata: {},
      },
    },
  };

  const payload = extractPaymentPayloadFromEvent(event);
  assert.equal(payload, null);
});

