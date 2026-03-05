/**
 * Middleware de Rate Limiting
 * Configuraciones específicas de rate limiting por tipo de endpoint
 */

const rateLimit = require('express-rate-limit');

/**
 * Rate limiter para autenticación (5 requests por 15 minutos)
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: {
    success: false,
    message: 'Demasiados intentos de autenticación, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // No contar requests exitosos
});

/**
 * Rate limiter para creación de recursos (20 requests por 15 minutos)
 */
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Demasiadas solicitudes de creación, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter general (100 requests por 15 minutos)
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  createLimiter,
  generalLimiter,
};
