/**
 * Validadores para obras
 * Validaciones para creación, actualización y consulta de obras
 */

const { body, query, param } = require('express-validator');
const { isValidObjectId, isValidPrice } = require('../utils/validators');

/**
 * Validaciones para crear obra
 */
const validateCreateArtwork = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('La descripción no puede exceder 5000 caracteres'),

  body('type')
    .notEmpty()
    .withMessage('El tipo de obra es requerido')
    .isIn(['digital', 'physical'])
    .withMessage('El tipo debe ser "digital" o "physical"'),

  body('price')
    .notEmpty()
    .withMessage('El precio es requerido')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo')
    .custom((value) => {
      if (!isValidPrice(value)) {
        throw new Error('El precio debe tener máximo 2 decimales');
      }
      return true;
    }),

  body('images')
    .optional()
    .isArray()
    .withMessage('Las imágenes deben ser un array')
    .custom((value) => {
      if (value.length > 10) {
        throw new Error('No se pueden agregar más de 10 imágenes');
      }
      return true;
    }),

  body('technique')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La técnica no puede exceder 200 caracteres'),

  // Validaciones condicionales para obras físicas
  body('dimensions')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Las dimensiones no pueden exceder 100 caracteres'),

  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El peso debe ser un número positivo'),

  // Validaciones condicionales para obras digitales
  body('digitalFormat')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El formato digital no puede exceder 50 caracteres'),

  body('resolution')
    .optional()
    .trim(),

  body('language')
    .optional()
    .isIn(['es', 'en'])
    .withMessage('El idioma debe ser "es" o "en"'),
];

/**
 * Validaciones para actualizar obra
 */
const validateUpdateArtwork = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('La descripción no puede exceder 5000 caracteres'),

  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo')
    .custom((value) => {
      if (value !== undefined && !isValidPrice(value)) {
        throw new Error('El precio debe tener máximo 2 decimales');
      }
      return true;
    }),

  body('images')
    .optional()
    .isArray()
    .withMessage('Las imágenes deben ser un array')
    .custom((value) => {
      if (value.length > 10) {
        throw new Error('No se pueden agregar más de 10 imágenes');
      }
      return true;
    }),

  body('technique')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('La técnica no puede exceder 200 caracteres'),

  body('dimensions')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Las dimensiones no pueden exceder 100 caracteres'),

  body('weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El peso debe ser un número positivo'),

  body('digitalFormat')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El formato digital no puede exceder 50 caracteres'),

  body('resolution')
    .optional()
    .trim(),

  body('language')
    .optional()
    .isIn(['es', 'en'])
    .withMessage('El idioma debe ser "es" o "en"'),
];

/**
 * Validaciones para consulta de galería (query params)
 */
const validateGalleryQuery = [
  query('artistId')
    .optional()
    .custom((value) => {
      if (value && !isValidObjectId(value)) {
        throw new Error('ID de artista inválido');
      }
      return true;
    }),

  query('type')
    .optional()
    .isIn(['digital', 'physical'])
    .withMessage('El tipo debe ser "digital" o "physical"'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio mínimo debe ser un número positivo'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio máximo debe ser un número positivo'),

  query('language')
    .optional()
    .isIn(['es', 'en'])
    .withMessage('El idioma debe ser "es" o "en"'),

  query('search')
    .optional()
    .trim(),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'price', 'title'])
    .withMessage('El ordenamiento debe ser por createdAt, price o title'),

  query('sortOrder')
    .optional()
    .isIn(['1', '-1', 'asc', 'desc'])
    .withMessage('El orden debe ser asc o desc'),
];

/**
 * Validación de ID de obra
 */
const validateArtworkId = [
  param('id')
    .notEmpty()
    .withMessage('El ID de la obra es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de obra inválido');
      }
      return true;
    }),
];

module.exports = {
  validateCreateArtwork,
  validateUpdateArtwork,
  validateGalleryQuery,
  validateArtworkId,
};
