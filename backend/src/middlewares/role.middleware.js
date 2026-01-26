/**
 * Middleware de Autorización por Roles
 * Verifica que el usuario tenga los roles necesarios para acceder
 */

/**
 * Middleware para requerir uno o más roles
 * @param {...string} roles - Roles permitidos
 * @returns {Function} - Middleware function
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    // Verificar que el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida',
      });
    }

    // Verificar que el usuario tiene uno de los roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
        requiredRoles: roles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

/**
 * Middleware para requerir rol de comprador
 */
const requireBuyer = requireRole('buyer');

/**
 * Middleware para requerir rol de artista
 */
const requireArtist = requireRole('artist');

/**
 * Middleware para requerir rol de administrador
 */
const requireAdmin = requireRole('admin');

/**
 * Middleware para requerir rol de artista o administrador
 */
const requireArtistOrAdmin = requireRole('artist', 'admin');

/**
 * Middleware para requerir rol de comprador o artista
 */
const requireBuyerOrArtist = requireRole('buyer', 'artist');

module.exports = {
  requireRole,
  requireBuyer,
  requireArtist,
  requireAdmin,
  requireArtistOrAdmin,
  requireBuyerOrArtist,
};
