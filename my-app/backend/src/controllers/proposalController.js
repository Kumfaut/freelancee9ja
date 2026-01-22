import db from "../config/db.js";

export const createProposal = async (req, res) => {
  const freelancer_id = req.user.id; 
  const { job_id, bid_amount, cover_letter, timeline, delivery_days } = req.body;

  try {
    if (!job_id || !bid_amount) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const finalDays = delivery_days || timeline || null;

    // 1. Insert Proposal - Changed [result] to just [] or use underscore [_result] to fix ESLint
    await db.execute(
      `INSERT INTO proposals (job_id, freelancer_id, bid_amount, cover_letter, delivery_days, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [job_id, freelancer_id, bid_amount, cover_letter || null, finalDays]
    );

    // 2. Fetch Job & Freelancer Info for notifications
    const [[jobInfo]] = await db.execute("SELECT client_id, title FROM jobs WHERE id = ?", [job_id]);
    const [[freelancer]] = await db.execute("SELECT full_name FROM users WHERE id = ?", [freelancer_id]);

    if (jobInfo) {
      const { client_id: clientId, title: jobTitle } = jobInfo;
      const io = req.app.get("socketio");

      // --- CLIENT NOTIFICATION (Database) ---
      await db.execute(
        `INSERT INTO notifications (user_id, type, content, link, is_read) VALUES (?, 'proposal', ?, ?, 0)`,
        [clientId, `New proposal for: ${jobTitle}`, `/manage-proposals/${job_id}`]
      );

      // --- CLIENT NOTIFICATION (Real-time) ---
      if (io) {
        io.to(`user_${clientId}`).emit("new_notification", {
          type: 'proposal',
          message: `New proposal from ${freelancer.full_name} for ${jobTitle}`
        });
      }

      // --- FREELANCER NOTIFICATION (Database) ---
      await db.execute(
        `INSERT INTO notifications (user_id, type, content, link, is_read) VALUES (?, 'proposal_sent', ?, ?, 0)`,
        [freelancer_id, `You submitted a proposal for: ${jobTitle}`, `/my-proposals`]
      );

      // --- FREELANCER NOTIFICATION (Real-time) ---
      if (io) {
        io.to(`user_${freelancer_id}`).emit("new_notification", {
          type: 'proposal_sent',
          message: `Your proposal for "${jobTitle}" was submitted successfully!`
        });
      }
    }

    // 3. Return response ONLY after notifications are processed
    return res.status(201).json({ success: true, message: "Proposal submitted!" });

  } catch (error) {
    console.error("Proposal Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};


export const getMyProposals = async (req, res) => {
  const freelancer_id = req.user.id;

  try {
    const sql = `
      SELECT 
        p.*, 
        j.title as job_title, 
        u.full_name as client_name,
        c.id as contract_id 
      FROM proposals p
      JOIN jobs j ON p.job_id = j.id
      JOIN users u ON j.client_id = u.id
      LEFT JOIN contracts c ON p.id = c.proposal_id
      WHERE p.freelancer_id = ?
      ORDER BY p.created_at DESC
    `;
    const [results] = await db.execute(sql, [freelancer_id]);
    res.json(results);
  } catch (error) {
    console.error("Error fetching freelancer proposals:", error);
    res.status(500).json({ error: error.message });
  }
};

// ... existing createProposal and getMyProposals code ...

// ADD THIS EXPORT:
export const getClientProposals = async (req, res) => {
  const clientId = req.user.id;
  try {
    const sql = `
      SELECT p.*, j.title as job_title, u.full_name as freelancer_name 
      FROM proposals p
      JOIN jobs j ON p.job_id = j.id
      JOIN users u ON p.freelancer_id = u.id
      WHERE j.client_id = ?
    `;
    const [results] = await db.execute(sql, [clientId]);
    res.json({ success: true, data: results });
  } catch (error) {
    console.error("Error fetching client proposals:", error);
    res.status(500).json({ error: error.message });
  }
};

// backend/src/controllers/proposalController.js

export const getProposalsByJob = async (req, res) => {
  const { jobId } = req.params;
  const clientId = req.user.id;

  try {
    const sql = `
      SELECT 
        p.*, 
        u.full_name, 
        u.profile_image,
        u.title AS freelancer_title 
      FROM proposals p
      JOIN users u ON p.freelancer_id = u.id
      JOIN jobs j ON p.job_id = j.id
      WHERE p.job_id = ? AND j.client_id = ?
      ORDER BY p.created_at DESC
    `;
    
    const [results] = await db.execute(sql, [jobId, clientId]);
    res.json(results); 
  } catch (error) {
    console.error("Error fetching job proposals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};