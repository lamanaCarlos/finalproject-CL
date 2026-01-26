/**
 * Rutas de Artistas
 * Define los endpoints relacionados con perfiles de artistas
 */

const express = require('express');
const {
  createOrUpdateProfile,
  getPublicProfile,
  getMyProfile,
} = require('../controllers/artist.controller');
const { validateArtistProfile } = require('../validators/artist.validators');
const validate = require('../middlewares/validator.middleware');
const { authenticate, optionalAuthenticate } = require('../middlewares/auth.middleware');
const { requireArtist } = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * @route   POST /api/artists/profile
 * @desc    Crear o actualizar perfil de artista
 * @access  Private (artist)
 */
router.post(
  '/profile',
  authenticate,
  requireArtist,
  validateArtistProfile,
  validate,
  createOrUpdateProfile
);

/**
 * @route   GET /api/artists/me/profile
 * @desc    Obtener mi perfil de artista
 * @access  Private (artist)
 */
router.get(
  '/me/profile',
  authenticate,
  requireArtist,
  getMyProfile
);

/**
 * @route   GET /api/artists/:id
 * @desc    Obtener perfil público de artista
 * @access  Public (pero solo muestra perfiles aprobados, excepto para admin)
 */
router.get(
  '/:id',
  optionalAuthenticate,
  getPublicProfile
);

module.exports = router;
