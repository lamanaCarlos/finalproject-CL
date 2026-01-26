/**
 * Controlador de Administración
 * Maneja operaciones del panel de administración
 */

const { User, ArtistProfile, Artwork, Order, CommissionRequest, PlatformSettings } = require('../models');
const {
  getPlatformMetricsPipeline,
  getArtworkMetricsPipeline,
  getSalesMetricsPipeline,
  getCommissionMetricsPipeline,
  getTopArtistsPipeline,
} = require('../aggregations/admin.aggregations');
const { formatDatabaseError } = require('../utils/dbErrors');
const logger = require('../utils/logger');

/**
 * Listar usuarios
 * GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const { role, isActive } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener usuarios:', error);
    next(error);
  }
};

/**
 * Actualizar estado de usuario
 * PATCH /api/admin/users/:id/status
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // No permitir desactivar al propio admin
    if (id === req.user.id && !isActive) {
      return res.status(400).json({
        success: false,
        message: 'No puedes desactivar tu propia cuenta',
      });
    }

    user.isActive = isActive;
    await user.save();

    logger.info(`Estado de usuario actualizado: ${id} -> ${isActive} por admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Estado de usuario actualizado exitosamente',
      data: user,
    });
  } catch (error) {
    logger.error('Error al actualizar estado de usuario:', error);
    next(error);
  }
};

/**
 * Listar artistas
 * GET /api/admin/artists
 */
const getArtists = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const { status } = req.query;

    const query = {};
    if (status) query.status = status;

    const artists = await ArtistProfile.find(query)
      .populate('userId', 'email isActive')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ArtistProfile.countDocuments(query);

    res.status(200).json({
      success: true,
      data: artists,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener artistas:', error);
    next(error);
  }
};

/**
 * Actualizar estado de artista
 * PATCH /api/admin/artists/:id/status
 */
const updateArtistStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const profile = await ArtistProfile.findById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Perfil de artista no encontrado',
      });
    }

    profile.status = status;
    await profile.save();

    logger.info(`Estado de artista actualizado: ${id} -> ${status} por admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Estado de artista actualizado exitosamente',
      data: profile,
    });
  } catch (error) {
    logger.error('Error al actualizar estado de artista:', error);

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
 * Listar todas las obras
 * GET /api/admin/artworks
 */
const getArtworks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const { status, type, artistId } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (artistId) query.artistId = artistId;

    const artworks = await Artwork.find(query)
      .populate('artistId', 'displayName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Artwork.countDocuments(query);

    res.status(200).json({
      success: true,
      data: artworks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener obras:', error);
    next(error);
  }
};

/**
 * Actualizar estado de obra
 * PATCH /api/admin/artworks/:id/status
 */
const updateArtworkStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const artwork = await Artwork.findById(id);

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra no encontrada',
      });
    }

    artwork.status = status;
    await artwork.save();

    logger.info(`Estado de obra actualizado: ${id} -> ${status} por admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Estado de obra actualizado exitosamente',
      data: artwork,
    });
  } catch (error) {
    logger.error('Error al actualizar estado de obra:', error);

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
 * Obtener configuración de plataforma
 * GET /api/admin/settings
 */
const getSettings = async (req, res, next) => {
  try {
    const settings = await PlatformSettings.getSettings();

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    logger.error('Error al obtener configuración:', error);
    next(error);
  }
};

/**
 * Actualizar configuración de plataforma
 * PATCH /api/admin/settings
 */
const updateSettings = async (req, res, next) => {
  try {
    const updates = {};
    if (req.body.minimumCommission !== undefined) {
      updates.minimumCommission = req.body.minimumCommission;
    }
    if (req.body.supportedLanguages !== undefined) {
      updates.supportedLanguages = req.body.supportedLanguages;
    }

    const settings = await PlatformSettings.updateSettings(updates, req.user.id);

    logger.info(`Configuración actualizada por admin ${req.user.id}`);

    res.status(200).json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: settings,
    });
  } catch (error) {
    logger.error('Error al actualizar configuración:', error);

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
 * Obtener métricas globales
 * GET /api/admin/metrics
 */
const getMetrics = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    // Ejecutar todas las agregaciones en paralelo
    const [
      userMetrics,
      artworkMetrics,
      salesMetrics,
      commissionMetrics,
      topArtists,
    ] = await Promise.all([
      User.aggregate(getPlatformMetricsPipeline()),
      Artwork.aggregate(getArtworkMetricsPipeline()),
      Order.aggregate(getSalesMetricsPipeline({ startDate, endDate })),
      CommissionRequest.aggregate(getCommissionMetricsPipeline()),
      Order.aggregate(getTopArtistsPipeline({ limit: 10, startDate, endDate })),
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: userMetrics[0] || { users: [], activeUsers: [] },
        artworks: artworkMetrics[0] || {},
        sales: salesMetrics[0] || {},
        commissions: commissionMetrics[0] || {},
        topArtists: topArtists || [],
      },
    });
  } catch (error) {
    logger.error('Error al obtener métricas:', error);
    next(error);
  }
};

module.exports = {
  getUsers,
  updateUserStatus,
  getArtists,
  updateArtistStatus,
  getArtworks,
  updateArtworkStatus,
  getSettings,
  updateSettings,
  getMetrics,
};
