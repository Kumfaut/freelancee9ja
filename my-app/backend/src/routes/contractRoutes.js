import express from "express";
import { 
  hireFreelancer, 
  getContractById, 
  submitContractWork,
  getUserContracts,
  releaseMilestone 
} from "../controllers/contractController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// --- 1. POST ROUTES ---
router.post("/hire", verifyToken, hireFreelancer);

// Must match: axios.post(.../release-milestone)
router.post("/:id/release-milestone", verifyToken, releaseMilestone);

// Must match: axios.post(.../submit-milestone)
router.post("/:id/submit-milestone", verifyToken, submitContractWork); 

// --- 2. GET ROUTES ---
router.get("/user/all", verifyToken, getUserContracts);
router.get("/:id", verifyToken, getContractById);

export default router;
