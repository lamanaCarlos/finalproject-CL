/**
 * Rutas de Subida de Archivos
 * Define los endpoints relacionados con la subida de imágenes
 */

const express = require('express');
const { uploadImage, uploadImages, deleteImage } = require('../controllers/upload.controller');
const { uploadSingle, uploadMultiple } = require('../middlewares/upload.middleware');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   POST /api/upload/image
 * @desc    Subir una imagen
 * @access  Private
 */
router.post('/image', authenticate, uploadSingle, uploadImage);

/**
 * @route   POST /api/upload/images
 * @desc    Subir múltiples imágenes
 * @access  Private
 */
router.post('/images', authenticate, uploadMultiple, uploadImages);

/**
 * @route   DELETE /api/upload/:filename
 * @desc    Eliminar una imagen
 * @access  Private
 */
router.delete('/:filename', authenticate, deleteImage);

module.exports = router;
