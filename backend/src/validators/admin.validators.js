/**
 * Validadores para administración
 * Validaciones para operaciones de administrador
 */

const { body, param, query } = require('express-validator');
const { isValidObjectId, isValidPercentage } = require('../utils/validators');

/**
 * Validaciones para actualizar estado de usuario
 */
const validateUpdateUserStatus = [
  body('isActive')
    .notEmpty()
    .withMessage('El estado es requerido')
    .isBoolean()
    .withMessage('El estado debe ser true o false'),
];

/**
 * Validaciones para actualizar estado de artista
 */
const validateUpdateArtistStatus = [
  body('status')
    .notEmpty()
    .withMessage('El estado es requerido')
    .isIn(['pending', 'approved', 'blocked'])
    .withMessage('El estado debe ser: pending, approved o blocked'),
];

/**
 * Validaciones para actualizar estado de obra
 */
const validateUpdateArtworkStatus = [
  body('status')
    .notEmpty()
    .withMessage('El estado es requerido')
    .isIn(['draft', 'published', 'sold'])
    .withMessage('El estado debe ser: draft, published o sold'),
];

/**
 * Validaciones para actualizar configuración de plataforma
 */
const validateUpdateSettings = [
  body('minimumCommission')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('La comisión mínima debe ser un número entre 0 y 100')
    .custom((value) => {
      if (value !== undefined && !isValidPercentage(value)) {
        throw new Error('La comisión mínima debe ser un porcentaje válido');
      }
      return true;
    }),

  body('supportedLanguages')
    .optional()
    .isArray()
    .withMessage('Los idiomas soportados deben ser un array')
    .custom((value) => {
      if (value.length === 0) {
        throw new Error('Debe haber al menos un idioma soportado');
      }
      const validLanguages = ['es', 'en'];
      const invalid = value.filter(lang => !validLanguages.includes(lang));
      if (invalid.length > 0) {
        throw new Error(`Idiomas inválidos: ${invalid.join(', ')}`);
      }
      return true;
    }),
];

/**
 * Validaciones de IDs
 */
const validateUserId = [
  param('id')
    .notEmpty()
    .withMessage('El ID de usuario es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de usuario inválido');
      }
      return true;
    }),
];

const validateArtistId = [
  param('id')
    .notEmpty()
    .withMessage('El ID de artista es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de artista inválido');
      }
      return true;
    }),
];

const validateArtworkId = [
  param('id')
    .notEmpty()
    .withMessage('El ID de obra es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de obra inválido');
      }
      return true;
    }),
];

/**
 * Validaciones para consultas de listado
 */
const validateListQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),

  query('role')
    .optional()
    .isIn(['buyer', 'artist', 'admin'])
    .withMessage('El rol debe ser: buyer, artist o admin'),

  query('status')
    .optional()
    .isIn(['pending', 'approved', 'blocked'])
    .withMessage('El estado debe ser: pending, approved o blocked'),
];

module.exports = {
  validateUpdateUserStatus,
  validateUpdateArtistStatus,
  validateUpdateArtworkStatus,
  validateUpdateSettings,
  validateUserId,
  validateArtistId,
  validateArtworkId,
  validateListQuery,
};
