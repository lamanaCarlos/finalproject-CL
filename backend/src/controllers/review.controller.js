const { Review, Order } = require('../models');
const logger = require('../utils/logger');

const createReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { orderId, rating, comment } = req.body;

    const order = await Order.findById(orderId).select('buyerId artistId artworkId paymentStatus');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado',
      });
    }

    if (order.buyerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Solo el comprador de este pedido puede reseñar',
      });
    }

    if (order.paymentStatus !== 'payment_succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Solo se puede reseñar una compra con pago confirmado',
      });
    }

    const existing = await Review.findOne({ orderId, buyerId: userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una reseña para este pedido',
      });
    }

    const review = await Review.create({
      orderId,
      artworkId: order.artworkId,
      artistId: order.artistId,
      buyerId: userId,
      rating,
      comment: comment || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Reseña creada exitosamente',
      data: review,
    });
  } catch (error) {
    logger.error('Error al crear reseña:', error);
    return next(error);
  }
};

const getArtworkReviews = async (req, res, next) => {
  try {
    const { artworkId } = req.params;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    const query = { artworkId };
    const reviews = await Review.find(query)
      .populate('buyerId', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Review.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener reseñas de obra:', error);
    return next(error);
  }
};

const getArtistReviews = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    const query = { artistId };
    const reviews = await Review.find(query)
      .populate('buyerId', 'email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Review.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener reseñas de artista:', error);
    return next(error);
  }
};

module.exports = {
  createReview,
  getArtworkReviews,
  getArtistReviews,
};

