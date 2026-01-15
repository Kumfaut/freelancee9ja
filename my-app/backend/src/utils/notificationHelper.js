import db from "../config/db.js";

export const createNotification = async (userId, type, content, link = null) => {
  try {
    // Note: I matched these columns to your DB: id, user_id, type, content, is_read, link, created_at
    await db.query(
      "INSERT INTO notifications (user_id, type, content, is_read, link) VALUES (?, ?, ?, FALSE, ?)",
      [userId, type, content, link]
    );
    console.log(`🔔 Notification sent to User ${userId}`);
  } catch (error) {
    console.error("❌ Notification Helper Error:", error.message);
  }
};