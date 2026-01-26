/**
 * Rutas de Obras
 * Define los endpoints relacionados con obras de arte
 */

const express = require('express');
const {
  createArtwork,
  getPublicGallery,
  getArtworkDetail,
  updateArtwork,
  publishArtwork,
  unpublishArtwork,
  getMyArtworks,
} = require('../controllers/artwork.controller');
const {
  validateCreateArtwork,
  validateUpdateArtwork,
  validateGalleryQuery,
  validateArtworkId,
} = require('../validators/artwork.validators');
const validate = require('../middlewares/validator.middleware');
const { authenticate, optionalAuthenticate } = require('../middlewares/auth.middleware');
const { requireArtist } = require('../middlewares/role.middleware');

const router = express.Router();

/**
 * @route   POST /api/artworks
 * @desc    Crear nueva obra
 * @access  Private (artist)
 */
router.post(
  '/',
  authenticate,
  requireArtist,
  validateCreateArtwork,
  validate,
  createArtwork
);

/**
 * @route   GET /api/artworks
 * @desc    Obtener galería pública de obras
 * @access  Public
 */
router.get(
  '/',
  optionalAuthenticate,
  validateGalleryQuery,
  validate,
  getPublicGallery
);

/**
 * @route   GET /api/artworks/my/list
 * @desc    Obtener mis obras (artista)
 * @access  Private (artist)
 */
router.get(
  '/my/list',
  authenticate,
  requireArtist,
  getMyArtworks
);

/**
 * @route   GET /api/artworks/:id
 * @desc    Obtener detalle de obra
 * @access  Public (obra publicada) / Private (obra propia o admin)
 */
router.get(
  '/:id',
  optionalAuthenticate,
  validateArtworkId,
  validate,
  getArtworkDetail
);

/**
 * @route   PUT /api/artworks/:id
 * @desc    Actualizar obra
 * @access  Private (artist, propietario o admin)
 */
router.put(
  '/:id',
  authenticate,
  requireArtist,
  validateArtworkId,
  validate,
  validateUpdateArtwork,
  validate,
  updateArtwork
);

/**
 * @route   PATCH /api/artworks/:id/publish
 * @desc    Publicar obra
 * @access  Private (artist, propietario o admin)
 */
router.patch(
  '/:id/publish',
  authenticate,
  requireArtist,
  validateArtworkId,
  validate,
  publishArtwork
);

/**
 * @route   PATCH /api/artworks/:id/unpublish
 * @desc    Despublicar obra
 * @access  Private (artist, propietario o admin)
 */
router.patch(
  '/:id/unpublish',
  authenticate,
  requireArtist,
  validateArtworkId,
  validate,
  unpublishArtwork
);

module.exports = router;
