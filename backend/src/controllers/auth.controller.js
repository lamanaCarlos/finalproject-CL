/**
 * Controlador de Autenticación
 * Maneja registro y login de usuarios
 */

const { User } = require('../models');
const { generateToken } = require('../services/auth.service');
const { formatDatabaseError } = require('../utils/dbErrors');
const logger = require('../utils/logger');

/**
 * Registro de nuevo usuario
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado',
      });
    }

    // Crear nuevo usuario
    const user = new User({
      email: email.toLowerCase(),
      password,
      role,
      isActive: true,
    });

    await user.save();

    logger.info(`Usuario registrado: ${user.email} (${user.role})`);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error('Error en registro:', error);

    // Manejar errores de base de datos
    const dbError = formatDatabaseError(error);
    if (dbError.statusCode) {
      return res.status(dbError.statusCode).json({
        success: false,
        ...dbError,
      });
    }

    next(error);
  }
};

/**
 * Login de usuario
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email (incluyendo password para comparar)
    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Verificar que el usuario está activo
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Usuario desactivado',
      });
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Generar token JWT
    const token = generateToken(user);

    logger.info(`Usuario autenticado: ${user.email} (${user.role})`);

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        role: user.role,
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    logger.error('Error en login:', error);
    next(error);
  }
};

module.exports = {
  register,
  login,
};
