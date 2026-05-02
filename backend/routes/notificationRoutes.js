import express from 'express';
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getNotifications);
router.route('/unread-count').get(protect, admin, getUnreadCount);
router.route('/read-all').put(protect, admin, markAllAsRead);
router.route('/:id/read').put(protect, admin, markAsRead);

export default router;
