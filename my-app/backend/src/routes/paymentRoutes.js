import express from "express";
import {
  initializePayment,
  verifyPayment,
  getWalletStatus,
  withdrawFunds,
  releaseEscrowToFreelancer,
  fundProjectEscrow,
  refundEscrowToClient,
  verifyBankAccount
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. BANK ACCOUNT VERIFICATION (Only one definition!)
router.get("/verify-account", verifyToken, verifyBankAccount); 

// 2. WALLET STATUS
router.get("/wallet-status", verifyToken, getWalletStatus);

// 3. DEPOSITS & PAYMENTS
router.post("/initialize", verifyToken, initializePayment);
router.post("/verify-payment", verifyToken, verifyPayment);

// 4. ESCROW ACTIONS
router.post("/escrow/fund", verifyToken, fundProjectEscrow);
router.post("/escrow/release", verifyToken, releaseEscrowToFreelancer);
router.post("/escrow/refund", verifyToken, refundEscrowToClient);

// 5. WITHDRAW FUNDS
router.post("/withdraw", verifyToken, withdrawFunds);

export default router;