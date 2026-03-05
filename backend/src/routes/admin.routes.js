/**
 * Rutas de Administración
 * Define los endpoints del panel de administración
 */

const express = require('express');
const {
  getUsers,
  updateUserStatus,
  getArtists,
  updateArtistStatus,
  getArtworks,
  updateArtworkStatus,
  getSettings,
  updateSettings,
  getMetrics,
} = require('../controllers/admin.controller');
const {
  validateUpdateUserStatus,
  validateUpdateArtistStatus,
  validateUpdateArtworkStatus,
  validateUpdateSettings,
  validateUserId,
  validateArtistId,
  validateArtworkId,
  validateListQuery,
} = require('../validators/admin.validators');
const validate = require('../middlewares/validator.middleware');
const { authenticate } = require('../middlewares/auth.middleware');
const { requireAdmin } = require('../middlewares/role.middleware');

const router = express.Router();

// Todas las rutas requieren autenticación y rol de administrador
router.use(authenticate);
router.use(requireAdmin);

/**
 * @route   GET /api/admin/users
 * @desc    Listar usuarios
 * @access  Private (admin)
 */
router.get(
  '/users',
  validateListQuery,
  validate,
  getUsers
);

/**
 * @route   PATCH /api/admin/users/:id/status
 * @desc    Actualizar estado de usuario
 * @access  Private (admin)
 */
router.patch(
  '/users/:id/status',
  validateUserId,
  validate,
  validateUpdateUserStatus,
  validate,
  updateUserStatus
);

/**
 * @route   GET /api/admin/artists
 * @desc    Listar artistas
 * @access  Private (admin)
 */
router.get(
  '/artists',
  validateListQuery,
  validate,
  getArtists
);

/**
 * @route   PATCH /api/admin/artists/:id/status
 * @desc    Actualizar estado de artista
 * @access  Private (admin)
 */
router.patch(
  '/artists/:id/status',
  validateArtistId,
  validate,
  validateUpdateArtistStatus,
  validate,
  updateArtistStatus
);

/**
 * @route   GET /api/admin/artworks
 * @desc    Listar todas las obras
 * @access  Private (admin)
 */
router.get(
  '/artworks',
  validateListQuery,
  validate,
  getArtworks
);

/**
 * @route   PATCH /api/admin/artworks/:id/status
 * @desc    Actualizar estado de obra
 * @access  Private (admin)
 */
router.patch(
  '/artworks/:id/status',
  validateArtworkId,
  validate,
  validateUpdateArtworkStatus,
  validate,
  updateArtworkStatus
);

/**
 * @route   GET /api/admin/settings
 * @desc    Obtener configuración de plataforma
 * @access  Private (admin)
 */
router.get('/settings', getSettings);

/**
 * @route   PATCH /api/admin/settings
 * @desc    Actualizar configuración de plataforma
 * @access  Private (admin)
 */
router.patch(
  '/settings',
  validateUpdateSettings,
  validate,
  updateSettings
);

/**
 * @route   GET /api/admin/metrics
 * @desc    Obtener métricas globales
 * @access  Private (admin)
 */
router.get('/metrics', getMetrics);

module.exports = router;
