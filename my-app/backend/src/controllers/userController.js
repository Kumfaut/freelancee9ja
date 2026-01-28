import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/cvs/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/cvs/'); // Ensure this folder exists!
  },
  filename: (req, file, cb) => {
    // Save file as: userId-timestamp.pdf
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `cv-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

export const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.mimetype.includes("msword") || file.mimetype.includes("officedocument")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF and Word documents allowed"), false);
    }
  }
});


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

// 4. GET PUBLIC PROFILE (Updated to include Skills and CV)
export const getPublicProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get user details - Added 'skills' to the selection
    // userController.js inside getPublicProfile
    const [user] = await db.execute(
      "SELECT id, full_name, title, bio, location, hourlyRate, profile_image, cv_url, skills, is_verified FROM users WHERE id = ?", 
      [id]
    );

    if (user.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Get reviews for this user
    const [reviews] = await db.execute(`
      SELECT r.rating, r.comment, r.created_at, u.full_name as reviewer_name 
      FROM reviews r 
      JOIN users u ON r.reviewer_id = u.id 
      WHERE r.reviewee_id = ? 
      ORDER BY r.created_at DESC`, 
      [id]
    );

    const profileData = { ...user[0] };
    
    // Fix Windows path slashes for the browser
    if (profileData.cv_url) {
      profileData.cv_url = profileData.cv_url.replace(/\\/g, '/');
    }

    // Parse skills if they are stored as a JSON string
    if (profileData.skills && typeof profileData.skills === 'string') {
        try {
            profileData.skills = JSON.parse(profileData.skills);
        } catch (e) {
            profileData.skills = profileData.skills.split(','); // Fallback for comma-separated strings
        }
    }

    res.status(200).json({ 
      ...profileData, 
      reviews: reviews || [] 
    });

  } catch (error) {
    console.error("Public Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// --- SETUP PROFILE (Saves skills as JSON string) ---
export const setupProfile = async (req, res) => {
  // Use destructuring with default nulls
  const { 
    tagline = null, 
    bio = null, 
    skills = null, 
    hourlyRate = null 
  } = req.body;
  
  const userId = req.user.id;
  const cvPath = req.file ? req.file.path : null;

  try {
    // 1. Fetch current data to preserve existing info
    const [rows] = await db.execute("SELECT title, bio, skills, hourlyRate, cv_url FROM users WHERE id = ?", [userId]);
    const user = rows[0];

    // 2. Logic: If the new value is undefined/null, keep the database value. 
    // If that's also empty, use null (never undefined).
    const finalTagline = tagline ?? user.title ?? null;
    const finalBio = bio ?? user.bio ?? null;
    const finalRate = hourlyRate ?? user.hourlyRate ?? null;
    const finalCV = cvPath ?? user.cv_url ?? null;

    // Handle skills stringification safely
    let finalSkills = user.skills ?? null;
    if (skills) {
      finalSkills = typeof skills === 'string' ? skills : JSON.stringify(skills);
    }

    // 3. Execute with explicit null-checks
    await db.execute(
      `UPDATE users SET 
        title = ?, 
        bio = ?, 
        skills = ?, 
        hourlyRate = ?, 
        cv_url = ?, 
        is_setup_complete = 1 
      WHERE id = ?`,
      [finalTagline, finalBio, finalSkills, finalRate, finalCV, userId]
    );

    res.status(200).json({ 
      success: true, 
      message: "Profile updated successfully", 
      cv_url: finalCV 
    });

  } catch (error) {
    console.error("Setup Profile Error:", error);
    res.status(500).json({ success: false, message: "Database update failed" });
  }
};
// 5. UPDATE PROFILE
// controllers/userController.js

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    // Destructure what the frontend is sending
    const { name, title, location, hourlyRate, bio } = req.body;

    // Check for undefined values and convert to null for MySQL
    const sqlName = name ?? null;
    const sqlTitle = title ?? null;
    const sqlLocation = location ?? null;
    const sqlRate = hourlyRate ?? null;
    const sqlBio = bio ?? null;

    // IMPORTANT: Check your table column names! 
    // Is it 'full_name' or 'name' in your database?
    await db.query(
      `UPDATE users SET full_name = ?, title = ?, location = ?, hourlyRate = ?, bio = ? WHERE id = ?`,
      [sqlName, sqlTitle, sqlLocation, sqlRate, sqlBio, userId]
    );

    return res.json({ success: true, message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. GET ALL USERS
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

export const getFreelancerStats = async (req, res) => {
  const userId = req.user.id; 

  try {
    // 1. Get Sum of Earnings (Matches your Row 23/24)
    const [earnings] = await db.execute(
      "SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE user_id = ? AND type = 'payment' AND status = 'completed'",
      [userId]
    );

    // 2. Get Count of Active Contracts
    const [activeJobs] = await db.execute(
      "SELECT COUNT(*) as activeCount FROM contracts WHERE freelancer_id = ? AND status = 'active'",
      [userId]
    );

    // 3. Get Average Rating (FIXED: Using reviewee_id instead of receiver_id)
    const [ratings] = await db.execute(
      "SELECT COALESCE(AVG(rating), 0) as avgRating FROM reviews WHERE reviewee_id = ?",
      [userId]
    );

    res.json({
      success: true,
      totalEarnings: earnings[0].total,
      activeJobs: activeJobs[0].activeCount,
      rating: parseFloat(ratings[0].avgRating || 0).toFixed(1)
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// controllers/userController.js
export const verifyNIN = async (req, res) => {
  try {
    const { nin_number } = req.body;
    const userId = req.user.id; // From verifyToken middleware

    // Mock validation
    if (!nin_number || nin_number.length !== 11) {
      return res.status(400).json({ success: false, message: "Invalid NIN" });
    }

    // Update DB
    await db.execute("UPDATE users SET is_verified = 1 WHERE id = ?", [userId]);

    res.json({ success: true, message: "Identity verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};