import express from "express";
import { 
  getNotifications, 
  markAsRead, 
  markAllRead, 
  deleteNotification,
  getUnreadCount // Now properly imported
} from "../controllers/notificationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/", verifyToken, getNotifications);

// GET the unread count specifically
router.get("/unread-count", verifyToken, getUnreadCount);

// Mark a single notification as read
router.put("/:id/read", verifyToken, markAsRead);

// Mark all notifications as read
router.put("/mark-all-read", verifyToken, markAllRead);

// Delete a notification
router.delete("/:id", verifyToken, deleteNotification);

export default router;