/**
 * Controlador de Encargos Personalizados
 * Maneja operaciones relacionadas con encargos
 */

const { CommissionRequest, User, ArtistProfile } = require('../models');
const { formatDatabaseError } = require('../utils/dbErrors');
const logger = require('../utils/logger');
const { createNotification } = require('../services/notification.service');

/**
 * Solicitar encargo
 * POST /api/commissions
 */
const createCommission = async (req, res, next) => {
  try {
    const buyerId = req.user.id;
    const { artistId, title, description, budget, deadline } = req.body;

    // Verificar que el usuario tiene rol de comprador
    if (req.user.role !== 'buyer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los compradores pueden solicitar encargos',
      });
    }

    // Verificar que el artista existe y está aprobado
    const artist = await User.findById(artistId);
    if (!artist || artist.role !== 'artist') {
      return res.status(404).json({
        success: false,
        message: 'Artista no encontrado',
      });
    }

    const artistProfile = await ArtistProfile.findOne({ userId: artistId });
    if (!artistProfile || artistProfile.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'El artista no está disponible para recibir encargos',
      });
    }

    // Verificar que el comprador no es el artista
    if (artistId === buyerId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes solicitar un encargo a ti mismo',
      });
    }

    // Crear encargo
    const commission = new CommissionRequest({
      buyerId,
      artistId,
      title: title || '',
      description,
      budget,
      deadline: deadline ? new Date(deadline) : undefined,
      status: 'pending',
    });

    await commission.save();

    logger.info(`Encargo creado: ${commission._id} - Comprador ${buyerId} -> Artista ${artistId}`);

    await createNotification({
      userId: artistId,
      type: 'commission_created',
      title: 'Nuevo encargo recibido',
      message: `Has recibido un nuevo encargo (${commission._id})`,
      entityType: 'commission',
      entityId: commission._id,
    });

    res.status(201).json({
      success: true,
      message: 'Encargo solicitado exitosamente',
      data: commission,
    });
  } catch (error) {
    logger.error('Error al crear encargo:', error);

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
 * Obtener mis encargos
 * GET /api/commissions/my
 */
const getMyCommissions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Parámetros de paginación y filtros
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const status = req.query.status; // Filtro opcional por estado

    // Construir query según rol
    const query = {};
    if (userRole === 'buyer') {
      query.buyerId = userId;
    } else if (userRole === 'artist' || userRole === 'admin') {
      query.artistId = userId;
    } else {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver encargos',
      });
    }

    if (status) {
      query.status = status;
    }

    // Obtener encargos con paginación
    const commissions = await CommissionRequest.find(query)
      .populate('buyerId', 'email')
      .populate('artistId', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await CommissionRequest.countDocuments(query);

    res.status(200).json({
      success: true,
      data: commissions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener mis encargos:', error);
    next(error);
  }
};

/**
 * Obtener detalle de encargo
 * GET /api/commissions/:id
 */
const getCommissionDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const commission = await CommissionRequest.findById(id)
      .populate('buyerId', 'email')
      .populate('artistId', 'email')
      .populate('messages.senderId', 'email');

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: 'Encargo no encontrado',
      });
    }

    // Verificar que el usuario es comprador o artista del encargo (o admin)
    if (
      commission.buyerId._id.toString() !== userId &&
      commission.artistId._id.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este encargo',
      });
    }

    res.status(200).json({
      success: true,
      data: commission,
    });
  } catch (error) {
    logger.error('Error al obtener detalle de encargo:', error);
    next(error);
  }
};

/**
 * Gestionar encargo (cambiar estado)
 * PATCH /api/commissions/:id
 */
const updateCommissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { status, agreedPrice } = req.body;

    const commission = await CommissionRequest.findById(id);

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: 'Encargo no encontrado',
      });
    }

    // Verificar que el usuario es el artista del encargo (o admin)
    if (commission.artistId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo el artista puede gestionar este encargo',
      });
    }

    // Validar transiciones de estado
    if (status === 'accepted') {
      if (commission.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden aceptar encargos pendientes',
        });
      }
      await commission.accept(agreedPrice);
    } else if (status === 'rejected') {
      if (commission.status !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden rechazar encargos pendientes',
        });
      }
      await commission.reject();
    } else if (status === 'in_progress') {
      if (commission.status !== 'accepted') {
        return res.status(400).json({
          success: false,
          message: 'Solo se puede iniciar trabajo en encargos aceptados',
        });
      }
      await commission.startWork();
    } else if (status === 'completed') {
      if (commission.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden completar encargos en progreso',
        });
      }
      await commission.complete();
    } else if (status === 'cancelled') {
      if (['completed', 'rejected'].includes(commission.status)) {
        return res.status(400).json({
          success: false,
          message: 'No se puede cancelar un encargo completado o rechazado',
        });
      }
      await commission.cancel();
    }

    logger.info(`Estado de encargo actualizado: ${id} -> ${status} por usuario ${userId}`);

    await createNotification({
      userId: commission.buyerId,
      type: 'commission_status_changed',
      title: 'Actualización de encargo',
      message: `Tu encargo ${commission._id} cambió a estado ${commission.status}`,
      entityType: 'commission',
      entityId: commission._id,
    });

    res.status(200).json({
      success: true,
      message: 'Estado del encargo actualizado exitosamente',
      data: commission,
    });
  } catch (error) {
    logger.error('Error al actualizar estado de encargo:', error);

    // Manejar errores específicos de métodos del modelo
    if (error.message.includes('Solo se puede')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

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
 * Agregar mensaje a encargo
 * POST /api/commissions/:id/messages
 */
const addMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { message } = req.body;

    const commission = await CommissionRequest.findById(id);

    if (!commission) {
      return res.status(404).json({
        success: false,
        message: 'Encargo no encontrado',
      });
    }

    // Verificar que el usuario es comprador o artista del encargo
    if (
      commission.buyerId.toString() !== userId &&
      commission.artistId.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para agregar mensajes a este encargo',
      });
    }

    // Agregar mensaje
    await commission.addMessage(userId, message);

    logger.info(`Mensaje agregado a encargo: ${id} por usuario ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Mensaje agregado exitosamente',
      data: commission,
    });
  } catch (error) {
    logger.error('Error al agregar mensaje:', error);

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

module.exports = {
  createCommission,
  getMyCommissions,
  getCommissionDetail,
  updateCommissionStatus,
  addMessage,
};
