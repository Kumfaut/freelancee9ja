import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// 1. REGISTER USER
export const registerUser = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)",
      [full_name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    const token = jwt.sign(
      { id: userId, role: role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    return res.status(201).json({ 
      message: "User registered successfully", 
      token, 
      user: { id: userId, full_name, role, email } 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 2. LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ message: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1d" }
    );

    return res.json({ 
      token, 
      user: { id: user.id, full_name: user.full_name, role: user.role } 
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 3. GET PRIVATE PROFILE (Logged in user)
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; 
    const [results] = await db.query(
      "SELECT id, full_name, email, role, title, location, hourlyRate, bio, created_at FROM users WHERE id = ?", 
      [userId]
    );

    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    return res.json(results[0]);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 4. GET PUBLIC PROFILE (For others to see)
export const getPublicProfile = async (req, res) => {
  const { id } = req.params;
  console.log(`Backend: Fetching public profile for ID: ${id}`);

  try {
    const [rows] = await db.execute(
      "SELECT id, full_name, bio, profile_image, title, hourlyRate FROM users WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Return the user object directly
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Public Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 5. UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, title, location, hourlyRate, bio } = req.body;

    await db.query(
      `UPDATE users SET full_name = ?, title = ?, location = ?, hourlyRate = ?, bio = ? WHERE id = ?`,
      [full_name, title, location, hourlyRate, bio, userId]
    );

    return res.json({ message: "Profile updated successfully!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// 6. GET ALL USERS (Admin/Search)
export const getUsers = async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, full_name, email, role FROM users");
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTopFreelancers = async (req, res) => {
  try {
    // We select the specific columns available in your users table
    const sql = `
      SELECT 
        id, 
        full_name, 
        profile_image, 
        title, 
        location, 
        hourlyRate, 
        bio,
        role
      FROM users 
      WHERE role = 'freelancer' 
      ORDER BY id DESC 
      LIMIT 6
    `;

    const [rows] = await db.execute(sql);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error("Error fetching top freelancers:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch freelancers" 
    });
  }
};