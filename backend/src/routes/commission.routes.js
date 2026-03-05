/**
 * Rutas de Encargos Personalizados
 * Define los endpoints relacionados con encargos
 */

const express = require('express');
const {
  createCommission,
  getMyCommissions,
  getCommissionDetail,
  updateCommissionStatus,
  addMessage,
} = require('../controllers/commission.controller');
const {
  validateCreateCommission,
  validateUpdateCommissionStatus,
  validateAddMessage,
  validateCommissionId,
} = require('../validators/commission.validators');
const validate = require('../middlewares/validator.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireBuyer, requireArtist } = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * @route   POST /api/commissions
 * @desc    Solicitar encargo
 * @access  Private (buyer)
 */
router.post(
  '/',
  authenticate,
  requireBuyer,
  validateCreateCommission,
  validate,
  createCommission
);

/**
 * @route   GET /api/commissions/my
 * @desc    Obtener mis encargos
 * @access  Private (buyer/artist)
 */
router.get(
  '/my',
  authenticate,
  getMyCommissions
);

/**
 * @route   GET /api/commissions/:id
 * @desc    Obtener detalle de encargo
 * @access  Private (buyer/artist del encargo o admin)
 */
router.get(
  '/:id',
  authenticate,
  validateCommissionId,
  validate,
  getCommissionDetail
);

/**
 * @route   PATCH /api/commissions/:id
 * @desc    Gestionar encargo (cambiar estado)
 * @access  Private (artist del encargo o admin)
 */
router.patch(
  '/:id',
  authenticate,
  requireArtist,
  validateCommissionId,
  validate,
  validateUpdateCommissionStatus,
  validate,
  updateCommissionStatus
);

/**
 * @route   POST /api/commissions/:id/messages
 * @desc    Agregar mensaje a encargo
 * @access  Private (buyer/artist del encargo)
 */
router.post(
  '/:id/messages',
  authenticate,
  validateCommissionId,
  validate,
  validateAddMessage,
  validate,
  addMessage
);

module.exports = router;
