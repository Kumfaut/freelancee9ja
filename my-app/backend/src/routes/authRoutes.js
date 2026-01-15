import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 
import db from "../config/db.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// THE PROFILE SYNC ROUTE
// backend/src/routes/authRoutes.js
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      // Ensure this matches your DB exactly: use 'balance'
      "SELECT id, full_name, email, role, balance, profile_image FROM users WHERE id = ?", 
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: rows[0] });
  } catch (error) {
    console.error("Profile Sync Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;