import db from "../config/db.js";

// Get all notifications for the logged-in user
export const getNotifications = async (req, res) => {
  const user_id = req.user.id;

  try {
    // 1. Get the actual notifications
    const [notifications] = await db.execute(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [user_id]
    );

    // 2. Get the count of unread items only
    const [unread] = await db.execute(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [user_id]
    );

    // Return as an object so frontend can easily access both
    res.json({
      success: true,
      data: notifications,
      unreadCount: unread[0].count
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
export const getUnreadCount = async (req, res) => {
  try {
    const [unread] = await db.execute(
      "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE",
      [req.user.id]
    );
    res.json({ success: true, unreadCount: unread[0].count });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
// backend/src/controllers/notificationController.js

export const markAllRead = async (req, res) => {
  const userId = req.user.id; 
  try {
    const [result] = await db.query(
      "UPDATE notifications SET is_read = TRUE WHERE user_id = ? AND is_read = FALSE",
      [userId]
    );
    
    res.json({ 
      success: true, 
      message: "All notifications marked as read",
      affectedRows: result.affectedRows 
    });
  } catch (error) {
    console.error("❌ markAllRead Error:", error);
    res.status(500).json({ success: false, message: "Failed to clear notifications" });
  }
};

// backend/src/controllers/notificationController.js

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // From auth middleware

  try {
    const [result] = await db.query(
      "DELETE FROM notifications WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("❌ Delete Notification Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute("UPDATE notifications SET is_read = TRUE WHERE id = ?", [id]);
    res.json({ message: "Notification updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

