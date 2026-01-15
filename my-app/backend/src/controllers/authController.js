import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// --- REGISTER USER ---
export const registerUser = async (req, res) => {
  console.log("!!! REQ BODY RECEIVED:", req.body);
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ 
      message: "Please provide all required fields",
      received: req.body 
    });
  }

  try {
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)", 
      [full_name, email, hashedPassword, role]
    );

    res.status(201).json({ 
      message: "User registered successfully", 
      userId: result.insertId,
      user: { full_name, email, role } 
    });

  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// --- LOGIN USER (Optimized for Wallet features) ---
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user in Database
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    // 2. Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT token (Includes email and role for security)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Send response 
    // IMPORTANT: We send the full user object so the frontend has the email for Paystack
    res.json({ 
      message: "Login successful", 
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};