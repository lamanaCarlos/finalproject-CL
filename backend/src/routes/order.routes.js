/**
 * Rutas de Pedidos/Órdenes
 * Define los endpoints relacionados con compras y ventas
 */

const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderDetail,
  updateShipping,
} = require('../controllers/order.controller');
const {
  validateCreateOrder,
  validateUpdateShipping,
  validateOrderId,
} = require('../validators/order.validators');
const validate = require('../middlewares/validator.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireBuyer, requireArtistOrAdmin } = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * @route   POST /api/orders
 * @desc    Crear pedido (comprar obra)
 * @access  Private (buyer)
 */
router.post(
  '/',
  authenticate,
  requireBuyer,
  validateCreateOrder,
  validate,
  createOrder
);

/**
 * @route   GET /api/orders/my
 * @desc    Obtener mis pedidos
 * @access  Private (buyer/artist)
 */
router.get(
  '/my',
  authenticate,
  getMyOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Obtener detalle de pedido
 * @access  Private (buyer/artist del pedido o admin)
 */
router.get(
  '/:id',
  authenticate,
  validateOrderId,
  validate,
  getOrderDetail
);

/**
 * @route   PATCH /api/orders/:id/shipping
 * @desc    Actualizar información de envío
 * @access  Private (artist del pedido o admin)
 */
router.patch(
  '/:id/shipping',
  authenticate,
  requireArtistOrAdmin,
  validateOrderId,
  validate,
  validateUpdateShipping,
  validate,
  updateShipping
);

module.exports = router;
