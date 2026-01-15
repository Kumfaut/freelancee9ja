import express from "express";
import axios from "axios";
import {
  initializePayment,
  verifyPayment,
  getWalletStatus,
  withdrawFunds,
  releaseEscrowToFreelancer,
  fundProjectEscrow,
  refundEscrowToClient,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 1. BANK ACCOUNT VERIFICATION
 * GET /api/wallet/verify-account
 */
router.get("/verify-account", verifyToken, async (req, res) => {
  const { accountNumber, bankCode } = req.query;

  if (!accountNumber || !bankCode) {
    return res.status(400).json({
      success: false,
      message: "Account number and bank code are required",
    });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve`,
      {
        params: {
          account_number: accountNumber,
          bank_code: bankCode,
        },
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return res.json({
      success: true,
      accountName: response.data.data.account_name,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid account details",
    });
  }
});

/**
 * 2. WALLET STATUS
 * GET /api/wallet/status/:userId
 */
router.get("/status/:userId", verifyToken, getWalletStatus);

/**
 * 3. WALLET DEPOSITS
 */
router.post("/initialize", verifyToken, initializePayment);
router.post("/verify-payment", verifyToken, verifyPayment);

/**
 * 4. ESCROW ACTIONS
 */
router.post("/escrow/fund", verifyToken, fundProjectEscrow);
router.post("/escrow/release", verifyToken, releaseEscrowToFreelancer);
router.post("/escrow/refund", verifyToken, refundEscrowToClient);

/**
 * 5. WITHDRAW FUNDS
 */
router.post("/withdraw", verifyToken, withdrawFunds);

export default router;
