/**
 * Servicio de Autenticación
 * Funciones para generar y verificar tokens JWT
 */

const jwt = require('jsonwebtoken');
const { getTokenOptions, getVerifyOptions } = require('../config/jwt');

/**
 * Genera un token JWT para un usuario
 * @param {Object} user - Objeto usuario con _id y role
 * @returns {string} - Token JWT
 */
const generateToken = (user) => {
  const payload = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, getTokenOptions());
};

/**
 * Verifica y decodifica un token JWT
 * @param {string} token - Token JWT a verificar
 * @returns {Object} - Payload decodificado
 * @throws {Error} - Si el token es inválido o expirado
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, getVerifyOptions());
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expirado');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Token inválido');
    }
    throw error;
  }
};

/**
 * Extrae el token del header Authorization
 * @param {Object} req - Request object
 * @returns {string|null} - Token extraído o null
 */
const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  // Formato: "Bearer <token>"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
};
