/**
 * Rutas de Usuarios
 * Define los endpoints relacionados con usuarios
 */

const express = require('express');
const { getMe } = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @route   GET /api/users/me
 * @desc    Obtener perfil propio
 * @access  Private (cualquier usuario autenticado)
 */
router.get('/me', authenticate, getMe);

module.exports = router;
