/**
 * Middleware de validación
 * Maneja errores de express-validator de forma consistente
 */

const { validationResult } = require('express-validator');

/**
 * Middleware para validar resultados de express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.array().map(err => ({
        field: err.param || err.path,
        message: err.msg,
        value: err.value,
      })),
    });
  }
  
  next();
};

module.exports = validate;
