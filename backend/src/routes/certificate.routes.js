const express = require('express');
const { getCertificateByOrder } = require('../controllers/certificate.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validateOrderIdParam } = require('../validators/order.validators');
const validate = require('../middlewares/validator.middleware');

const router = express.Router();

router.get('/order/:orderId', authenticate, validateOrderIdParam('orderId'), validate, getCertificateByOrder);

module.exports = router;

