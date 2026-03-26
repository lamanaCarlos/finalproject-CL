const express = require('express');
const { authenticate } = require('../middlewares/auth.middleware');
const { isValidObjectId } = require('../utils/validators');
const {
  getMyNotifications,
  markNotificationAsRead,
  getUnreadCount,
} = require('../controllers/notification.controller');

const router = express.Router();

router.get('/', authenticate, getMyNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.patch('/:id/read', authenticate, (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: 'ID de notificación inválido',
    });
  }
  return markNotificationAsRead(req, res, next);
});

module.exports = router;

