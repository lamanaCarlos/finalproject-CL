const express = require('express');
const { createIntent, stripeWebhook } = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireBuyer } = require('../middlewares/role.middleware');
const validate = require('../middlewares/validator.middleware');
const { validateCreatePaymentIntent } = require('../validators/payment.validators');

const router = express.Router();

router.post(
  '/create-intent',
  authenticate,
  requireBuyer,
  validateCreatePaymentIntent,
  validate,
  createIntent
);

router.post('/webhook/stripe', stripeWebhook);

module.exports = router;

