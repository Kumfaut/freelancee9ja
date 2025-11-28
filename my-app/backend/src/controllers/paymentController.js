import axios from "axios";
import db from "../config/db.js";

// Initialize payment with Paystack
export const initializePayment = (req, res) => {
  const { email, amount } = req.body;
  const userId = req.user.id; // comes from verifyToken middleware

  if (!email || !amount) {
    return res.status(400).json({ message: "Email and amount are required" });
  }

  axios.post(
    "https://api.paystack.co/transaction/initialize",
    { email, amount: amount * 100 }, // amount in kobo
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    }
  )
  .then(response => {
    const { reference } = response.data.data;

    // Save initial transaction in MySQL
    const sql = "INSERT INTO transactions (user_id, amount, reference, status) VALUES (?, ?, ?, ?)";
    db.query(sql, [userId, amount, reference, "pending"], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(response.data);
    });
  })
  .catch(error => {
    res.status(500).json({ error: error.response?.data || error.message });
  });
};

// Verify payment after transaction
export const verifyPayment = (req, res) => {
  const { reference } = req.params;

  if (!reference) return res.status(400).json({ message: "Reference is required" });

  axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })
  .then(response => {
    const { status, amount, customer } = response.data.data;

    // Update transaction status in MySQL
    const sql = "UPDATE transactions SET status = ? WHERE reference = ?";
    db.query(sql, [status, reference], (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Payment verified successfully", status, amount, customer });
    });
  })
  .catch(error => {
    res.status(500).json({ error: error.response?.data || error.message });
  });
};
