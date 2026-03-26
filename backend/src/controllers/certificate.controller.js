const { Certificate, Order } = require('../models');
const logger = require('../utils/logger');

const getCertificateByOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;

    const order = await Order.findById(orderId).select('buyerId artistId');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado',
      });
    }

    const isOwner =
      order.buyerId.toString() === userId ||
      order.artistId.toString() === userId ||
      role === 'admin';

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este certificado',
      });
    }

    const certificate = await Certificate.findOne({ orderId })
      .populate('artworkId', 'title type')
      .populate('buyerId', 'email')
      .populate('artistId', 'email');

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificado no encontrado para este pedido',
      });
    }

    return res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    logger.error('Error al obtener certificado por pedido:', error);
    return next(error);
  }
};

module.exports = {
  getCertificateByOrder,
};

