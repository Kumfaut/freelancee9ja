import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  getCategoryStats,
  getLatestJobs,
  getSavedJobs,
  toggleSaveJob,
  getRecommendedJobs
} from "../controllers/jobController.js";
// Changed to only import verifyToken to keep it simple
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Static/Stats Routes
router.get("/stats/categories", getCategoryStats); 

// 2. User Routes (Verified)
router.get("/my-jobs", verifyToken, getMyJobs);
router.get("/saved/all", verifyToken, getSavedJobs);
router.post("/save", verifyToken, toggleSaveJob);

// 3. Public Routes
router.get("/latest", getLatestJobs); 
router.get("/", getJobs);

// Changed 'protect' to 'verifyToken' here
router.get("/recommended/personal", verifyToken, getRecommendedJobs);

// 4. Dynamic Route (Must be after /latest and /stats)
router.get("/:id", getJobById);

// 5. Protected Action Routes
router.post("/", verifyToken, createJob);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);

export default router;