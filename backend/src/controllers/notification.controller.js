const { Notification } = require('../models');
const logger = require('../utils/logger');

const getMyNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);

    const query = { userId };
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error al obtener notificaciones:', error);
    return next(error);
  }
};

const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOne({ _id: id, userId });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada',
      });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json({
      success: true,
      message: 'Notificación marcada como leída',
      data: notification,
    });
  } catch (error) {
    logger.error('Error al marcar notificación como leída:', error);
    return next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const unreadCount = await Notification.countDocuments({
      userId,
      isRead: false,
    });

    return res.status(200).json({
      success: true,
      data: { unreadCount },
    });
  } catch (error) {
    logger.error('Error al obtener contador de no leídas:', error);
    return next(error);
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  getUnreadCount,
};

