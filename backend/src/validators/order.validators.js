/**
 * Validadores para pedidos/órdenes
 * Validaciones para creación y actualización de pedidos
 */

const { body, param } = require('express-validator');
const { isValidObjectId, isValidPrice } = require('../utils/validators');

/**
 * Validaciones para crear pedido (comprar obra)
 */
const validateCreateOrder = [
  body('artworkId')
    .notEmpty()
    .withMessage('El ID de la obra es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de obra inválido');
      }
      return true;
    }),
];

/**
 * Validaciones para actualizar envío
 */
const validateUpdateShipping = [
  body('shippingStatus')
    .notEmpty()
    .withMessage('El estado de envío es requerido')
    .isIn(['pending', 'agreed', 'sent'])
    .withMessage('El estado de envío debe ser: pending, agreed o sent'),

  body('shippingInfo.address')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('La dirección debe tener entre 5 y 500 caracteres'),

  body('shippingInfo.trackingNumber')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El número de seguimiento no puede exceder 100 caracteres'),

  body('shippingInfo.shippingMethod')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El método de envío no puede exceder 100 caracteres'),

  body('shippingInfo.shippingCost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El costo de envío debe ser un número positivo')
    .custom((value) => {
      if (value !== undefined && !isValidPrice(value)) {
        throw new Error('El costo de envío debe tener máximo 2 decimales');
      }
      return true;
    }),
];

/**
 * Validación de ID de pedido
 */
const validateOrderId = [
  param('id')
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
  validateCreateOrder,
  validateUpdateShipping,
  validateOrderId,
};
