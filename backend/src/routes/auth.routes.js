/**
 * Rutas de Autenticación
 * Define los endpoints de registro y login
 */

const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const { validateRegister, validateLogin } = require('../validators/auth.validators');
const validate = require('../middlewares/validator.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registro de nuevo usuario
 * @access  Public
 */
router.post(
  '/register',
  authLimiter,
  validateRegister,
  validate,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post(
  '/login',
  authLimiter,
  validateLogin,
  validate,
  login
);

module.exports = router;
