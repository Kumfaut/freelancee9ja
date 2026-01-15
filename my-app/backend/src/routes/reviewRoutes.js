import express from "express";
import { createReview, getUserReviews } from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", verifyToken, createReview);
router.get("/user/:userId", getUserReviews);
export default router;