// src/routes/userRoutes.js
import express from "express";
import { registerUser, loginUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

// Get all users (for admin/testing)
router.get("/", getUsers);

export default router;
