import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// --- REGISTER USER (Direct Signup, No Email/OTP) ---
export const registerUser = async (req, res) => {
  const { full_name, email, password, role, phone, location } = req.body;

  // 1. Validate input
  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    // 2. Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert into DB (is_verified set to 1 by default since no OTP is used)
    const [result] = await db.query(
      "INSERT INTO users (full_name, email, phone, password, role, location, account_status, is_setup_complete) VALUES (?, ?, ?, ?, ?, ?, 'active', 0)", 
      [full_name, email, phone || null, hashedPassword, role, location || null]
    );

    const userId = result.insertId;

    // 5. Generate Token immediately (Allows auto-login after signup)
    const token = jwt.sign(
      { id: userId, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 6. Return response with token
    res.status(201).json({ 
      success: true,
      message: "Registration successful!",
      token,
      user: { 
        id: userId, 
        full_name, 
        email, 
        role 
      }
    });

  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ error: "Internal server error during registration" });
  }
};

// --- LOGIN USER ---
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

    // 3. Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. Send response 
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