const { Notification } = require('../models');

const createNotification = async ({
  userId,
  type,
  title,
  message,
  entityType = '',
  entityId = null,
}) => {
  if (!userId || !type || !title || !message) {
    return null;
  }

  return Notification.create({
    userId,
    type,
    title,
    message,
    entityType,
    entityId,
  });
};

module.exports = {
  createNotification,
};

