/**
 * Validadores para encargos personalizados
 * Validaciones para solicitud y gestión de encargos
 */

const { body, param } = require('express-validator');
const { isValidObjectId, isValidPrice, isFutureDate } = require('../utils/validators');

/**
 * Validaciones para solicitar encargo
 */
const validateCreateCommission = [
  body('artistId')
    .notEmpty()
    .withMessage('El ID del artista es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de artista inválido');
      }
      return true;
    }),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('El título no puede exceder 200 caracteres'),

  body('description')
    .notEmpty()
    .withMessage('La descripción del encargo es requerida')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('La descripción debe tener entre 10 y 5000 caracteres'),

  body('budget')
    .notEmpty()
    .withMessage('El presupuesto es requerido')
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número positivo')
    .custom((value) => {
      if (!isValidPrice(value)) {
        throw new Error('El presupuesto debe tener máximo 2 decimales');
      }
      return true;
    }),

  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('La fecha límite debe tener un formato válido (ISO 8601)')
    .custom((value) => {
      if (value && !isFutureDate(new Date(value))) {
        throw new Error('La fecha límite debe ser una fecha futura');
      }
      return true;
    }),
];

/**
 * Validaciones para gestionar encargo (cambiar estado)
 */
const validateUpdateCommissionStatus = [
  body('status')
    .notEmpty()
    .withMessage('El estado es requerido')
    .isIn(['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'])
    .withMessage('El estado debe ser: accepted, rejected, in_progress, completed o cancelled'),

  body('agreedPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio acordado debe ser un número positivo')
    .custom((value) => {
      if (value !== undefined && !isValidPrice(value)) {
        throw new Error('El precio acordado debe tener máximo 2 decimales');
      }
      return true;
    }),
];

/**
 * Validaciones para agregar mensaje
 */
const validateAddMessage = [
  body('message')
    .notEmpty()
    .withMessage('El mensaje es requerido')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('El mensaje debe tener entre 1 y 2000 caracteres'),
];

/**
 * Validación de ID de encargo
 */
const validateCommissionId = [
  param('id')
    .notEmpty()
    .withMessage('El ID del encargo es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) {
        throw new Error('ID de encargo inválido');
      }
      return true;
    }),
];

module.exports = {
  validateCreateCommission,
  validateUpdateCommissionStatus,
  validateAddMessage,
  validateCommissionId,
};
