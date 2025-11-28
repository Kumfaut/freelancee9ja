import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected routes
router.post("/", verifyToken, createJob);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);

export default router;
