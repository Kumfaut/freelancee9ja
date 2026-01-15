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
  toggleSaveJob// Already imported here
} from "../controllers/jobController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. Static/Stats Routes (Top priority)
// REMOVED 'jobController.' because you imported the function directly above
// backend/routes/jobRoutes.js

// 1. Static/Stats Routes (Top priority)
router.get("/stats/categories", getCategoryStats); 

// 2. Filtered/User Routes
router.get("/my-jobs", verifyToken, getMyJobs);
// backend/src/routes/jobRoutes.js
router.get("/saved/all", verifyToken, getSavedJobs);
router.post("/save", verifyToken, toggleSaveJob);

// 3. Public Listing Routes
// --- MOVE THIS ABOVE /:id ---
router.get("/latest", getLatestJobs); 

router.get("/", getJobs);

// --- DYNAMIC ROUTES LAST ---
router.get("/:id", getJobById);



// 4. Protected Action Routes
router.post("/", verifyToken, createJob);
router.put("/:id", verifyToken, updateJob);
router.delete("/:id", verifyToken, deleteJob);

export default router;
