import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { Server } from "socket.io";
import http from "http";

// Route Imports
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import contractRoutes from "./routes/contractRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import proposalRoutes from "./routes/proposalRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";


// Initialize environment variables
dotenv.config();

const app = express();

// 1. Precise CORS Configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"], // Add your React port here
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true
}));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
  allowEIO3: true // Helps with older socket-client versions
});

app.set("socketio", io);

// Live Connection Logic
// Live Connection Logic
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // 1. Join a specific conversation room
  socket.on("join_conversation", (conversationId) => {
    const roomName = `conv_${conversationId}`;
    socket.join(roomName);
    console.log(`👥 User joined room: ${roomName}`);
  });

  // 2. Optional: Join a personal room for global notifications
  socket.on("join_personal_room", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User joined personal room: user_${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("👋 User disconnected");
  });
});

// 2. Body Parsers (Must be above routes)
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 3. Registering the Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wallet", paymentRoutes);


// Protected route example
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({ message: "You are authorized", user: req.user });
});

// Test root
app.get("/", (req, res) => {
  res.send("🚀 Freelancee9ja API is working");
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server on port ${PORT}`));