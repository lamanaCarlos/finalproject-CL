/**
 * Middleware de Autenticación
 * Verifica tokens JWT y autentica usuarios
 */

const { User } = require('../models');
const { verifyToken, extractTokenFromHeader } = require('../services/auth.service');
const logger = require('../utils/logger');

/**
 * Middleware para autenticar usuarios mediante JWT
 * Agrega req.user con los datos del usuario autenticado
 */
const authenticate = async (req, res, next) => {
  try {
    // Extraer token del header
    const token = extractTokenFromHeader(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
      });
    }

    // Verificar token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Token inválido o expirado',
      });
    }

    // Buscar usuario en la base de datos
    const user = await User.findById(decoded.id).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Verificar que el usuario está activo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Usuario desactivado',
      });
    }

    // Agregar usuario al request (sin password)
    req.user = {
      _id: user._id,
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };

    next();
  } catch (error) {
    logger.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error al autenticar usuario',
    });
  }
};

/**
 * Middleware opcional de autenticación
 * No falla si no hay token, pero agrega req.user si existe
 */
const optionalAuthenticate = async (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);

    if (!token) {
      return next();
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (user && user.isActive) {
      req.user = {
        _id: user._id,
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      };
    }

    next();
  } catch (error) {
    // Si hay error, continuar sin autenticación
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuthenticate,
};
