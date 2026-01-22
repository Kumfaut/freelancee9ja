import express from 'express';
import db from '../config/db.js'; 
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * MIDDLEWARE: verifyAdmin
 * Ensure the user is authenticated via verifyToken first,
 * then check if their role is 'admin'.
 */
const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: "Access denied. Administrative privileges required." });
    }
};

// --- USER MANAGEMENT ---

// GET all users for the Admin Table
router.get('/users', verifyToken, verifyAdmin, async (req, res) => {
    const query = `
        SELECT id, full_name, email, role, account_status, created_at 
        FROM users 
        ORDER BY created_at DESC
    `;
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error("Admin Users Error:", err.message);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// PATCH update user account status (Suspend/Activate)
router.patch('/users/:id/status', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { newStatus } = req.body; // 'active', 'suspended', or 'pending'

    const sql = "UPDATE users SET account_status = ? WHERE id = ?";
    
    try {
        const [result] = await db.query(sql, [newStatus, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
        res.json({ success: true, message: `User status updated to ${newStatus}` });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user status" });
    }
});

// --- JOB MODERATION ---

// GET all jobs for moderation
router.get('/jobs', verifyToken, verifyAdmin, async (req, res) => {
    const sql = `
        SELECT j.job_id, j.title, j.budget, j.status, j.created_at, u.full_name as client_name 
        FROM jobs j
        JOIN users u ON j.client_id = u.id
        ORDER BY j.created_at DESC`;

    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
});

// PATCH update job status (Approve/Reject)
router.patch('/jobs/:id/status', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    try {
        const [result] = await db.query("UPDATE jobs SET status = ? WHERE job_id = ?", [status, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: "Job not found" });
        res.json({ success: true, message: `Job ${status} successfully` });
    } catch (err) {
        res.status(500).json({ error: "Failed to update job" });
    }
});

// --- FINANCIAL / ESCROW ---

// GET all escrow transactions
router.get('/transactions', verifyToken, verifyAdmin, async (req, res) => {
    const sql = "SELECT * FROM transactions WHERE type = 'escrow' ORDER BY created_at DESC";
    try {
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// PATCH release escrow funds
router.patch('/transactions/:id/release', verifyToken, verifyAdmin, async (req, res) => {
    const { id } = req.params;
    const sql = "UPDATE transactions SET status = 'released' WHERE id = ? AND type = 'escrow'";
    
    try {
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Transaction not found or already released" });
        }
        res.json({ success: true, message: "Funds successfully released to the freelancer" });
    } catch (err) {
        res.status(500).json({ error: "Database error during fund release" });
    }
});

router.get('/stats', verifyToken, verifyAdmin, async (req, res) => {
    try {
        // Run multiple counts in parallel for performance
        const [userCount] = await db.query("SELECT COUNT(*) as total FROM users");
        const [jobCount] = await db.query("SELECT COUNT(*) as total FROM jobs WHERE status = 'pending'");
        const [escrowTotal] = await db.query("SELECT SUM(escrow_balance) as total FROM users");
        
        res.json({
            totalUsers: userCount[0].total,
            pendingJobs: jobCount[0].total,
            escrowVolume: escrowTotal[0].total || 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;