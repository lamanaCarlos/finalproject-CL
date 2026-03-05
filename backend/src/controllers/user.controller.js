/**
 * Controlador de Usuarios
 * Maneja operaciones relacionadas con usuarios
 */

const { User } = require('../models');
const logger = require('../utils/logger');

/**
 * Obtener perfil propio
 * GET /api/users/me
 */
const getMe = async (req, res, next) => {
  try {
    // El usuario ya está en req.user gracias al middleware authenticate
    const userId = req.user.id;

    // Obtener usuario completo de la base de datos
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    logger.error('Error al obtener perfil:', error);
    next(error);
  }
};

module.exports = {
  getMe,
};
