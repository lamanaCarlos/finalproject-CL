/**
 * Controlador de Pedidos/Órdenes
 * Maneja operaciones relacionadas con compras y ventas
 */

const { Order, Artwork, ArtistProfile, PlatformSettings } = require('../models');
const { createOrderWithArtworkUpdate } = require('../utils/transactions');
const { formatDatabaseError } = require('../utils/dbErrors');
const logger = require('../utils/logger');
const { createNotification } = require('../services/notification.service');

/**
 * Crear pedido (comprar obra)
 * POST /api/orders
 */
const createOrder = async (req, res, next) => {
  try {
    const buyerId = req.user.id;
    const { artworkId } = req.body;

    // Verificar que el usuario tiene rol de comprador
    if (req.user.role !== 'buyer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los compradores pueden realizar compras',
      });
    }

    // Buscar obra
    const artwork = await Artwork.findById(artworkId).populate('artistId', 'userId status');

    if (!artwork) {
      return res.status(404).json({
        success: false,
        message: 'Obra no encontrada',
      });
    }

    // Verificar que la obra está publicada
    if (artwork.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'La obra no está disponible para la venta',
      });
    }

    // Verificar que el artista está aprobado
    if (artwork.artistId.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'La obra no está disponible',
      });
    }

    // Verificar que el comprador no es el artista
    if (artwork.artistId.userId.toString() === buyerId) {
      return res.status(400).json({
        success: false,
        message: 'No puedes comprar tu propia obra',
      });
    }

    // Obtener configuración de comisión
    const settings = await PlatformSettings.getSettings();
    const commissionPercentage = settings.minimumCommission;

    // Evitar múltiples órdenes activas para la misma obra
    const existingActiveOrder = await Order.findOne({
      artworkId: artwork._id,
      paymentStatus: { $in: ['payment_pending', 'payment_succeeded'] },
    });

    if (existingActiveOrder) {
      return res.status(400).json({
        success: false,
        message: 'Esta obra ya tiene una compra en proceso o confirmada',
      });
    }

    // Crear orden usando transacción (la obra se marca como vendida al confirmar pago)
    const order = await createOrderWithArtworkUpdate(
      {
        buyerId,
        artworkId: artwork._id,
        artistId: artwork.artistId.userId,
        price: artwork.price,
        shippingRequired: artwork.type === 'physical',
        shippingStatus: artwork.type === 'physical' ? 'pending' : undefined,
      },
      artworkId,
      commissionPercentage
    );

    logger.info(`Orden creada: ${order._id} - Obra ${artworkId} comprada por ${buyerId}`);

    res.status(201).json({
      success: true,
      message: 'Compra realizada exitosamente',
      data: order,
    });
  } catch (error) {
    logger.error('Error al crear pedido:', error);

    // Manejar errores específicos de transacciones
    if (error.message === 'Obra no encontrada') {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === 'La obra no está disponible para la venta') {
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
 * Obtener mis pedidos
 * GET /api/orders/my
 */
const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // Parámetros de paginación
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    // Construir query según rol
    const query = {};
    if (userRole === 'buyer') {
      query.buyerId = userId;
    } else if (userRole === 'artist' || userRole === 'admin') {
      query.artistId = userId;
    } else {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver pedidos',
      });
    }

    // Obtener pedidos con paginación
    const orders = await Order.find(query)
      .populate('artworkId', 'title images type')
      .populate('buyerId', 'email')
      .populate('artistId', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener mis pedidos:', error);
    next(error);
  }
};

/**
 * Obtener detalle de pedido
 * GET /api/orders/:id
 */
const getOrderDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(id)
      .populate('artworkId')
      .populate('buyerId', 'email')
      .populate('artistId', 'email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado',
      });
    }

    // Verificar que el usuario es comprador o artista del pedido (o admin)
    if (
      order.buyerId._id.toString() !== userId &&
      order.artistId._id.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este pedido',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    logger.error('Error al obtener detalle de pedido:', error);
    next(error);
  }
};

/**
 * Actualizar información de envío
 * PATCH /api/orders/:id/shipping
 */
const updateShipping = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { shippingStatus, shippingInfo } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado',
      });
    }

    // Verificar que el usuario es el artista del pedido (o admin)
    if (order.artistId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo el artista puede actualizar la información de envío',
      });
    }

    // Verificar que el pedido requiere envío
    if (!order.shippingRequired) {
      return res.status(400).json({
        success: false,
        message: 'Este pedido no requiere envío',
      });
    }

    // Actualizar estado y información de envío
    if (shippingStatus) {
      order.shippingStatus = shippingStatus;
    }

    if (shippingInfo) {
      if (shippingInfo.address) order.shippingInfo.address = shippingInfo.address;
      if (shippingInfo.trackingNumber) order.shippingInfo.trackingNumber = shippingInfo.trackingNumber;
      if (shippingInfo.shippingMethod) order.shippingInfo.shippingMethod = shippingInfo.shippingMethod;
      if (shippingInfo.shippingCost !== undefined) {
        order.shippingInfo.shippingCost = shippingInfo.shippingCost;
      }
    }

    await order.save();

    await createNotification({
      userId: order.buyerId,
      type: 'shipping_status_changed',
      title: 'Actualización de envío',
      message: `El pedido ${order._id} cambió su envío a ${order.shippingStatus}`,
      entityType: 'order',
      entityId: order._id,
    });

    logger.info(`Envío actualizado: pedido ${id} por usuario ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Información de envío actualizada exitosamente',
      data: order,
    });
  } catch (error) {
    logger.error('Error al actualizar envío:', error);

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
  createOrder,
  getMyOrders,
  getOrderDetail,
  updateShipping,
};
