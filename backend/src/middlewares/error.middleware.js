/**
 * Middleware de manejo centralizado de errores
 * Formatea y retorna errores de forma consistente
 */

const { ValidationError } = require('express-validator');
const { formatDatabaseError } = require('../utils/dbErrors');
const logger = require('../utils/logger');
const { config } = require('../config/env');

/**
 * Middleware de manejo de errores
 */
const errorMiddleware = (err, req, res, next) => {
  // Log del error
  logger.error('Error:', {
    message: err.message,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
  });

  // Error de validación de express-validator
  if (err instanceof ValidationError || err.array) {
    const errors = err.array ? err.array() : err.errors || [];
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: errors.map(e => ({
        field: e.param || e.path,
        message: e.msg || e.message,
        value: e.value,
      })),
    });
  }

  // Error de base de datos
  if (err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000) {
    const dbError = formatDatabaseError(err);
    return res.status(dbError.statusCode || 500).json(dbError);
  }

  // Error de autenticación/autorización
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado',
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: err.message || 'No autorizado',
    });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      message: err.message || 'Acceso prohibido',
    });
  }

  // Error genérico
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  });
};

module.exports = errorMiddleware;
