const { body } = require('express-validator');
const { isValidObjectId } = require('../utils/validators');

const validateCreatePaymentIntent = [
  body('orderId')
    .notEmpty()
    .withMessage('El ID del pedido es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de pedido inválido');
      }
      return true;
    }),
];

module.exports = {
  validateCreatePaymentIntent,
};

