import express from "express";
import { 
  sendMessage, 
  getChatMessages, 
  getInbox, 
  getChatHistory 
} from "../controllers/messageController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Get the list of all chats (The Sidebar)
router.get("/inbox", verifyToken, getInbox);

// 2. Get messages by Conversation ID (Existing Chat)
router.get("/chat/:conversationId", verifyToken, getChatMessages);

// 3. Get messages by User ID (Starting a chat from a profile)
router.get("/history/:otherUserId", verifyToken, getChatHistory);

// 4. Send a message
router.post("/send", verifyToken, sendMessage);

export default router;