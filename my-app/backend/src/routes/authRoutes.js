import express from "express";
import bcrypt from "bcrypt"; // Fixed: Added import
import jwt from "jsonwebtoken";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 
import passport from "../config/passport.js"
import db from "../config/db.js"; 

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// THE PROFILE SYNC ROUTE
router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
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

// TEMPORARY: Run once to fix admin password
router.get('/fix-admin', async (req, res) => {
  try {
      // Use the local bcrypt to generate the hash
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await db.query(
          "UPDATE users SET password = ? WHERE email = 'admin@naijafreelance.com'", 
          [hashedPassword]
      );
      res.send("Admin password fixed with local hash!");
  } catch (err) {
      console.error("Fix Admin Error:", err.message);
      res.status(500).send(err.message);
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
  passport.authenticate("google", { session: false }), 
  (req, res) => {
    // Generate your JWT token for the user
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    
    // Redirect back to frontend with the token in the URL 
    // (Frontend will grab it and save it to localStorage)
    res.redirect(`http://localhost:3000/login-success?token=${token}`);
  }
);

export default router;

