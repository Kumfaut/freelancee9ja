import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

// Register a new user
export const registerUser = async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(query, [full_name, email, hashedPassword, role], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      // Send response only after user is successfully inserted
      res.json({ message: "User registered successfully", userId: result.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login user
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(400).json({ error: "User not found" });

    const user = results[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token });
  });
};
