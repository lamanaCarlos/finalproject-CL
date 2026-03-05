/**
 * Validadores para autenticación
 * Usa express-validator para validar datos de registro y login
 */

const { body } = require('express-validator');
const { isValidEmail } = require('../utils/validators');

/**
 * Validaciones para registro de usuario
 */
const validateRegister = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .custom((value) => {
      if (!isValidEmail(value)) {
        throw new Error('El email no es válido');
      }
      return true;
    })
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),

  body('role')
    .notEmpty()
    .withMessage('El rol es requerido')
    .isIn(['buyer', 'artist'])
    .withMessage('El rol debe ser "buyer" o "artist"'),
];

/**
 * Validaciones para login
 */
const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('El email debe tener un formato válido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

module.exports = {
  validateRegister,
  validateLogin,
};
