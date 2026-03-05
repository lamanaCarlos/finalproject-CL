/**
 * Validadores para artistas
 * Validaciones para creación y actualización de perfiles de artista
 */

const { body } = require('express-validator');
const { isValidUrl } = require('../utils/validators');

/**
 * Validaciones para crear/actualizar perfil de artista
 */
const validateArtistProfile = [
  body('displayName')
    .trim()
    .notEmpty()
    .withMessage('El nombre artístico es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre artístico debe tener entre 2 y 100 caracteres'),

  body('bio')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La biografía no puede exceder 2000 caracteres'),

  body('profileImage')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isValidUrl(value)) {
        throw new Error('La URL de la imagen de perfil no es válida');
      }
      return true;
    }),

  body('socialLinks.instagram')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !/^https?:\/\/(www\.)?instagram\.com\/[\w.]+/.test(value)) {
        throw new Error('La URL de Instagram no es válida');
      }
      return true;
    }),

  body('socialLinks.web')
    .optional()
    .trim()
    .custom((value) => {
      if (value && !isValidUrl(value)) {
        throw new Error('La URL del sitio web no es válida');
      }
      return true;
    }),
];

module.exports = {
  validateArtistProfile,
};
