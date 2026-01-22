import axios from "axios";
import db from "../config/db.js";
import { createNotification } from "../utils/notificationHelper.js";

// --- 1. INITIALIZE PAYMENT (Deposit) ---
export const initializePayment = async (req, res) => {
  try {
    const { email, amount } = req.body;
    const userId = req.user?.id;

    if (!userId || !email || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1️⃣ Call Paystack
    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(parseFloat(amount) * 100), // in Kobo
        callback_url: "http://localhost:3000/wallet",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const { reference, authorization_url } = paystackRes.data.data;

    // 2️⃣ Insert DB record
    await db.query(
      "INSERT INTO transactions (user_id, amount, reference, status, description) VALUES (?, ?, ?, ?, ?)",
      [userId, amount, reference, "pending", "Wallet Deposit"]
    );

    return res.json({ success: true, data: { reference, authorization_url } });
  } catch (error) {
    console.error("❌ Paystack Init Error:", error.message);
    return res.status(500).json({ message: "Payment initialization failed" });
  }
};

// --- 2. VERIFY PAYMENT ---
export const verifyPayment = async (req, res) => {
  const { reference } = req.body;
  console.log("--- 🚀 Starting Verification for Ref:", reference, "---");

  const connection = await db.getConnection();

  try {
    // 1. Check local transaction record first
    const [transactions] = await connection.query(
      "SELECT * FROM transactions WHERE reference = ?", 
      [reference]
    );

    if (transactions.length === 0) {
      console.log("❌ Error: Reference not found in local DB");
      return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    const localTx = transactions[0];
    console.log("📝 Local Tx Found. Status:", localTx.status, "User ID:", localTx.user_id);

    if (localTx.status === 'success') {
      console.log("⚠️ Warning: This transaction was already successful.");
      return res.json({ success: true, message: "Already processed" });
    }

    // 2. Verify with Paystack
    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    const pData = paystackRes.data.data;
    console.log("📡 Paystack Response Status:", pData.status);

    if (pData.status === "success") {
      const amountInNaira = pData.amount / 100;
      const userId = localTx.user_id;

      console.log(`💰 Attempting to add ₦${amountInNaira} to User ID: ${userId}`);

      await connection.beginTransaction();

      // Update Transaction Table
      const [txUpdate] = await connection.query(
        "UPDATE transactions SET status = 'success' WHERE reference = ?", 
        [reference]
      );
      console.log("✅ Transaction status updated:", txUpdate.affectedRows);

      // Update User Balance Table
      const [userUpdate] = await connection.query(
        "UPDATE users SET balance = COALESCE(balance, 0) + ? WHERE id = ?", 
        [amountInNaira, userId]
      );
      console.log("✅ User balance updated:", userUpdate.affectedRows);

      await connection.commit();
      console.log("🏁 TRANSACTION COMMITTED SUCCESSFULLY");

      await createNotification(
        userId, 
        "payment", 
        `Success! ₦${amountInNaira.toLocaleString()} has been added to your wallet.`, 
        "/wallet"
      );

      return res.json({ success: true, message: "Wallet Updated!" });
    } else {
      console.log("❌ Paystack says payment failed.");
      return res.status(400).json({ success: false, message: "Payment failed" });
    }

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("💥 CRASH ERROR:", error.response?.data || error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  } finally {
    if (connection) connection.release();
    console.log("--- 🔚 Verification Process Ended ---");
  }
};

// --- 3. FUND PROJECT ESCROW ---
export const fundProjectEscrow = async (req, res) => {
  const { amount, projectId} = req.body;
  const clientId = req.user.id;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Lock the user row so no other request can touch the balance until we finish
    const [rows] = await connection.query(
      "SELECT balance FROM users WHERE id = ? FOR UPDATE", 
      [clientId]
    );

    const currentBalance = parseFloat(rows[0].balance || 0);
    if (currentBalance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: "Insufficient balance." });
    }

    // 2. Perform updates using the SAME connection
    await connection.query(
      "UPDATE users SET balance = balance - ?, escrow_balance = escrow_balance + ? WHERE id = ?",
      [amount, amount, clientId]
    );

    await connection.query(
      "INSERT INTO transactions (user_id, amount, status, description, type) VALUES (?, ?, 'success', ?, 'escrow_lock')",
      [clientId, amount, `Funds locked for Project #${projectId}`]
    );

    await connection.commit();
    
    // Notification logic here...
    res.json({ success: true, message: "Funds secured in escrow!" });
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, message: "Internal error" });
  } finally {
    if (connection) connection.release();
  }
};

// --- 4. RELEASE ESCROW TO FREELANCER ---
export const releaseEscrowToFreelancer = async (req, res) => {
  const { amount, freelancerId, projectId } = req.body;
  const clientId = req.user.id;

  try {
    await db.query("START TRANSACTION");
    const [clientRows] = await db.query("SELECT escrow_balance FROM users WHERE id = ?", [clientId]);

    if (!clientRows.length || clientRows[0].escrow_balance < amount) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "Insufficient escrow funds." });
    }

    const platformFee = amount * 0.10;
    const freelancerAmount = amount - platformFee;

    await db.query("UPDATE users SET escrow_balance = escrow_balance - ? WHERE id = ?", [amount, clientId]);
    await db.query("UPDATE users SET balance = balance + ? WHERE id = ?", [freelancerAmount, freelancerId]);
    await db.query("UPDATE users SET balance = balance + ? WHERE role = 'admin' LIMIT 1", [platformFee]);

    await db.query(
      "INSERT INTO transactions (user_id, amount, status, description, type) VALUES (?, ?, 'success', ?, 'payment_received')",
      [freelancerId, freelancerAmount, `Payment for Project #${projectId} (after fees)`]
    );
    await db.query(
      "INSERT INTO transactions (user_id, amount, status, description, type) VALUES (?, ?, 'success', ?, 'escrow_release')",
      [clientId, amount, `Released funds for Project #${projectId}`]
    );

    await db.query("COMMIT");

    // Notifications
    await createNotification(freelancerId, "payment", `You received ₦${freelancerAmount}!`, "/wallet");
    await createNotification(clientId, "payment", `You released ₦${amount} to the freelancer.`, "/wallet");

    res.json({ success: true, message: "Funds released successfully!" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("❌ Escrow Release Error:", error);
    res.status(500).json({ success: false, message: "Failed to release funds" });
  }
};

// --- 5. REFUND ESCROW TO CLIENT ---
export const refundEscrowToClient = async (req, res) => {
  const { amount, projectId, clientId } = req.body;

  try {
    await db.query("START TRANSACTION");
    const [rows] = await db.query("SELECT escrow_balance FROM users WHERE id = ?", [clientId]);

    if (!rows.length || rows[0].escrow_balance < amount) {
      await db.query("ROLLBACK");
      return res.status(400).json({ message: "Insufficient escrow funds to refund." });
    }

    await db.query(
      "UPDATE users SET escrow_balance = escrow_balance - ?, balance = balance + ? WHERE id = ?",
      [amount, amount, clientId]
    );
    await db.query(
      "INSERT INTO transactions (user_id, amount, status, description, type) VALUES (?, ?, 'success', ?, 'escrow_refund')",
      [clientId, amount, `Refunded from Project #${projectId} escrow`]
    );

    await db.query("COMMIT");
    res.json({ success: true, message: "Funds refunded to your balance." });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("❌ Refund Escrow Error:", err);
    res.status(500).json({ success: false, message: "Refund failed" });
  }
};

// --- 6. WITHDRAW FUNDS ---
export const withdrawFunds = async (req, res) => {
  const { amount, bankCode, accountNumber } = req.body;
  const userId = req.user.id;

  try {
    const [userRows] = await db.query("SELECT balance, full_name FROM users WHERE id = ?", [userId]);
    const currentBalance = parseFloat(userRows[0].balance || 0);

    if (currentBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance." });
    }

    const recipientRes = await axios.post(
      "https://api.paystack.co/transferrecipient",
      {
        type: "nuban",
        name: userRows[0].full_name,
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      },
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    const recipientCode = recipientRes.data.data.recipient_code;

    const transferRes = await axios.post(
      "https://api.paystack.co/transfer",
      {
        source: "balance",
        amount: Math.round(amount * 100),
        recipient: recipientCode,
        reason: "Wallet Withdrawal",
      },
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );

    if (transferRes.data.status) {
      await db.query("START TRANSACTION");
      try {
        await db.query("UPDATE users SET balance = balance - ? WHERE id = ?", [amount, userId]);
        await db.query(
          "INSERT INTO transactions (user_id, amount, status, description, reference) VALUES (?, ?, ?, ?, ?)",
          [userId, amount, "success", "Bank Withdrawal", transferRes.data.data.transfer_code]
        );
        await db.query("COMMIT");
        return res.json({ success: true, message: "Withdrawal successful!" });
      } catch (dbErr) {
        await db.query("ROLLBACK");
        throw dbErr;
      }
    }
  } catch (err) {
    console.error("❌ Withdrawal Error:", err.response?.data || err.message);
    return res.status(500).json({ message: err.response?.data?.message || "Withdrawal failed" });
  }
};

// --- 7. GET WALLET STATUS ---
export const getWalletStatus = async (req, res) => {
  const userId = req.user.id; // Get ID from token, not params

  try {
    const [userRows] = await db.query(
      "SELECT balance, escrow_balance FROM users WHERE id = ?",
      [userId]
    );

    if (!userRows.length) return res.status(404).json({ success: false, message: "User not found" });

    const [historyRows] = await db.query(
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
      [userId]
    );

    res.json({
      success: true, 
      balance: parseFloat(userRows[0].balance || 0),
      escrow: parseFloat(userRows[0].escrow_balance || 0),
      history: historyRows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Database error" });
  }
};

// backend/src/controllers/walletController.js

// --- NEW: VERIFY BANK ACCOUNT NAME ---
export const verifyBankAccount = async (req, res) => {
  // Use query params from the URL
  const { accountNumber, bankCode } = req.query;

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    // Paystack returns data.data.account_name
    return res.json({
      success: true,
      accountName: response.data.data.account_name,
    });
  } catch (error) {
    console.error("Paystack Resolve Error:", error.response?.data || error.message);
    return res.status(400).json({
      success: false,
      message: "Could not verify account name.",
    });
  }
};