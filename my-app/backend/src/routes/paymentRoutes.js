import express from "express";
import { initializePayment, verifyPayment } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only logged-in users can make/verify payments
router.post("/initialize", verifyToken, initializePayment);
router.get("/verify/:reference", verifyToken, verifyPayment);

export default router;
