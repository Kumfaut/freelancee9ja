import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUsers, 
  getUserProfile, 
  updateProfile,
  getPublicProfile,
  getTopFreelancers 
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- Public Routes ---
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);

// 1. Specific static path FIRST
router.get("/freelancers/top", getTopFreelancers);

// 2. Dynamic parameter path SECOND
router.get("/public/:id", getPublicProfile);

// --- Protected Routes ---
router.get("/profile", verifyToken, getUserProfile); 
router.put("/profile/update", verifyToken, updateProfile); 

export default router;