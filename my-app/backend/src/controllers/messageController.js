import db from "../config/db.js";

export const getInbox = async (req, res) => {
  const userId = req.user.id;

  try {
    const [conversations] = await db.query(
      `SELECT 
        c.id AS conversation_id,
        c.last_message,
        c.updated_at,
        u.id AS other_user_id,
        u.full_name AS other_user_name,
        u.profile_image AS other_user_image,
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
         AND m.receiver_id = ? 
         AND m.is_read = FALSE) AS unread_count
      FROM conversations c
      JOIN users u ON u.id = (CASE 
        WHEN c.user_one = ? THEN c.user_two 
        ELSE c.user_one 
      END)
      WHERE c.user_one = ? OR c.user_two = ?
      ORDER BY c.updated_at DESC`,
      [userId, userId, userId, userId]
    );

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load inbox" });
  }
};

export const sendMessage = async (req, res) => {
  const { conversation_id, receiver_id, message_text } = req.body;
  const sender_id = req.user.id;

  try {
    // 1. Save to DB
    const [result] = await db.query(
      "INSERT INTO messages (conversation_id, sender_id, receiver_id, message_text) VALUES (?, ?, ?, ?)",
      [conversation_id, sender_id, receiver_id, message_text]
    );

    // 2. Prepare the message object for the frontend/socket
    const newMessage = {
      id: result.insertId, // Note: Use insertId for MySQL
      conversation_id,
      sender_id,
      receiver_id,
      message_text,
      created_at: new Date()
    };

    // 3. EMIT VIA SOCKET (Check if 'io' is imported correctly!)
    // If you haven't attached io to req, make sure it's available here
    // backend/src/controllers/messageController.js

if (req.app.get("socketio")) {
  const roomName = `conv_${conversation_id}`; // This creates "conv_1"
  req.app.get("socketio").to(roomName).emit("new_message", newMessage);
  console.log(`📡 Broadcast to: ${roomName}`); 
}

    // 4. SEND ONE RESPONSE (This is where 500s usually happen)
    return res.status(201).json({ 
      success: true, 
      message: newMessage 
    });

  } catch (error) {
    console.error("Error in sendMessage:", error);
    // Ensure you only send ONE error response
    if (!res.headersSent) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};

export const getChatMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const [messages] = await db.query(
      "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
      [conversationId]
    );

    // Mark messages as read
    await db.query(
      "UPDATE messages SET is_read = TRUE WHERE conversation_id = ? AND sender_id != ?",
      [conversationId, req.user.id]
    );

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error loading messages" });
  }
};

export const getChatHistory = async (req, res) => {
  const userId = req.user.id;
  const { otherUserId } = req.params;

  try {
    const sql = `
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) 
      OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `;
    const [messages] = await db.execute(sql, [userId, otherUserId, otherUserId, userId]);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};