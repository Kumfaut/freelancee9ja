import express from "express";
import axios from "axios";
import { 
  initializePayment, 
  verifyPayment, 
  withdrawFunds, 
  getWalletStatus 
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. VERIFY BANK ACCOUNT (Place this FIRST)
// URL: http://localhost:5000/api/wallet/verify-account
router.get("/verify-account", verifyToken, async (req, res) => {
  const { accountNumber, bankCode } = req.query;

  if (!accountNumber || !bankCode) {
    return res.status(400).json({ success: false, message: "Missing params" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );
    
    return res.json({ 
      success: true, 
      accountName: response.data.data.account_name 
    });
  } catch (error) {
    console.error("Paystack Resolve Error:", error.response?.data || error.message);
    return res.status(400).json({ 
      success: false, 
      message: "Could not verify account details" 
    });
  }
});

// 2. OTHER ROUTES
router.get("/status/:userId", verifyToken, getWalletStatus);
router.post("/initialize", verifyToken, initializePayment);
router.post("/verify-payment", verifyToken, verifyPayment);
router.post("/withdraw", verifyToken, withdrawFunds);

export default router;