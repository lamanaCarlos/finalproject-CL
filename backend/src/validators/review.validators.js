const { body, param } = require('express-validator');
const { isValidObjectId } = require('../utils/validators');

const validateCreateReview = [
  body('orderId')
    .notEmpty()
    .withMessage('El ID del pedido es requerido')
    .custom((value) => {
      if (!isValidObjectId(value)) throw new Error('ID de pedido inválido');
      return true;
    }),
  body('rating')
    .notEmpty()
    .withMessage('La valoración es requerida')
    .isInt({ min: 1, max: 5 })
    .withMessage('La valoración debe estar entre 1 y 5'),
  body('comment')
    .optional()
    .isString()
    .isLength({ max: 1000 })
    .withMessage('El comentario no puede exceder 1000 caracteres'),
];

const validateArtworkIdParam = [
  param('artworkId')
    .custom((value) => {
      if (!isValidObjectId(value)) throw new Error('ID de obra inválido');
      return true;
    }),
];

const validateArtistIdParam = [
  param('artistId')
    .custom((value) => {
      if (!isValidObjectId(value)) throw new Error('ID de artista inválido');
      return true;
    }),
];

module.exports = {
  validateCreateReview,
  validateArtworkIdParam,
  validateArtistIdParam,
};

