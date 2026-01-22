import db from "../config/db.js";

// --- 1. HIRE FREELANCER ---
export const hireFreelancer = async (req, res) => {
  const { job_id, freelancer_id, proposal_id, amount, title } = req.body;
  const client_id = req.user.id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Move money to Escrow
    await connection.execute(
      "UPDATE users SET balance = balance - ?, escrow_balance = escrow_balance + ? WHERE id = ?",
      [amount, amount, client_id]
    );

    // 2. Create the Contract
    const [contract] = await connection.execute(
      `INSERT INTO contracts (job_id, client_id, freelancer_id, agreed_budget, status) 
       VALUES (?, ?, ?, ?, 'active')`,
      [job_id || null, client_id, freelancer_id, amount]
    );

    const contractId = contract.insertId;

    // 3. Create Milestone
    await connection.execute(
      "INSERT INTO milestones (contract_id, title, amount, status) VALUES (?, ?, ?, 'funded')",
      [contractId, title || "Project Phase", amount]
    );

    // 4. Update the proposal status
    if (proposal_id) {
      await connection.execute(
        "UPDATE proposals SET status = 'accepted' WHERE id = ?",
        [proposal_id]
      );
    }

    // 5. Update Job status
    if (job_id) {
      await connection.execute("UPDATE jobs SET status = 'filled' WHERE id = ?", [job_id]);
    }

    // --- NEW: NOTIFY FREELANCER OF HIRE ---
    // --- NOTIFY FREELANCER OF HIRE ---
    const hireMsg = `You've been hired for the project: ${title || 'New Job'}`;
    
    // 1. We use Number() to ensure freelancer_id is an integer
    // 2. We explicitly set is_read to 0 (false)
    await connection.execute(
      "INSERT INTO notifications (user_id, type, content, link, is_read) VALUES (?, ?, ?, ?, ?)",
      [Number(freelancer_id), 'hired', hireMsg, `/contract/${contractId}`, 0]
    );

    const io = req.app.get("socketio");
    if (io) {
      // Use the same Number() here to ensure the socket room string is correct
      io.to(`user_${Number(freelancer_id)}`).emit("new_notification", {
        type: 'hired',
        message: hireMsg
      });
    }
    
    await connection.commit();
    res.status(201).json({ success: true, contractId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// --- 2. GET SINGLE CONTRACT ---
export const getContractById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  try {
    const sql = `
      SELECT c.*, j.title as job_title,
             u_c.full_name as client_name, u_f.full_name as freelancer_name
      FROM contracts c
      LEFT JOIN jobs j ON c.job_id = j.id
      JOIN users u_c ON c.client_id = u_c.id
      JOIN users u_f ON c.freelancer_id = u_f.id
      WHERE c.id = ? AND (c.freelancer_id = ? OR c.client_id = ?)
    `;
    const [results] = await db.query(sql, [id, userId, userId]);
    res.status(200).json({ success: true, data: results[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- 3. GET ALL USER CONTRACTS ---
export const getUserContracts = async (req, res) => {
  try {
    const userId = req.user.id; 
    const [contracts] = await db.execute(
      `SELECT c.id, c.status, c.agreed_budget AS amount, c.start_date,
        IFNULL(j.title, 'Direct Project') AS job_title,
        u.full_name AS counterparty_name
      FROM contracts c
      LEFT JOIN jobs j ON c.job_id = j.id
      JOIN users u ON (CASE WHEN c.freelancer_id = ? THEN c.client_id ELSE c.freelancer_id END) = u.id
      WHERE c.freelancer_id = ? OR c.client_id = ?
      ORDER BY c.start_date DESC`,
      [userId, userId, userId]
    );
    res.status(200).json(contracts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contracts" });
  }
};

// --- 4. RELEASE MILESTONE ---
export const releaseMilestone = async (req, res) => {
  const { id: contractId } = req.params;
  const { milestoneId } = req.body;
  const clientId = req.user.id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [contracts] = await connection.execute(
      "SELECT c.freelancer_id, u.escrow_balance FROM contracts c JOIN users u ON c.client_id = u.id WHERE c.id = ? AND c.client_id = ?",
      [contractId, clientId]
    );

    if (contracts.length === 0) {
      return res.status(404).json({ success: false, message: "Contract or Client not found" });
    }

    const [milestones] = await connection.execute(
      "SELECT amount, status, title FROM milestones WHERE id = ? AND contract_id = ?",
      [milestoneId, contractId]
    );

    if (milestones.length === 0) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }

    const releaseAmount = milestones[0].amount;
    const freelancerId = contracts[0].freelancer_id;

    if (contracts[0].escrow_balance < releaseAmount) {
      return res.status(400).json({ success: false, message: "Insufficient Escrow Balance" });
    }

    const platformFee = releaseAmount * 0.10;
    const freelancerPayout = releaseAmount - platformFee;

    await connection.execute("UPDATE milestones SET status = 'completed' WHERE id = ?", [milestoneId]);
    await connection.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [freelancerPayout, freelancerId]);
    await connection.execute("UPDATE users SET escrow_balance = escrow_balance - ? WHERE id = ?", [releaseAmount, clientId]);

    const txnReference = `NT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await connection.execute(
      "INSERT INTO transactions (user_id, amount, reference, status, description, type) VALUES (?, ?, ?, ?, ?, ?)",
      [freelancerId, freelancerPayout, txnReference, 'completed', `Payout: ${milestones[0].title}`, 'payment']
    );

    // --- NEW: NOTIFY FREELANCER OF PAYMENT ---
    const paymentMsg = `Payment of ₦${freelancerPayout.toLocaleString()} released for: ${milestones[0].title}`;
    await connection.execute(
      "INSERT INTO notifications (user_id, type, content, link) VALUES (?, 'payment', ?, ?)",
      [freelancerId, paymentMsg, `/wallet`]
    );

    const io = req.app.get("socketio");
    if (io) {
      io.to(`user_${freelancerId}`).emit("new_notification", {
        type: 'payment',
        message: paymentMsg
      });
    }

    await connection.commit();
    res.json({ success: true, message: "Payment released! Fee deducted." });
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    if (connection) connection.release();
  }
};

// --- 5. COMPLETE PROJECT (Final Settlement) ---
export const completeProject = async (req, res) => {
  const { id: contractId } = req.params;
  const clientId = req.user.id;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Verify contract and ownership
    const [contracts] = await connection.execute(
      "SELECT freelancer_id FROM contracts WHERE id = ? AND client_id = ?", 
      [contractId, clientId]
    );
    
    if (contracts.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: "Contract not found" });
    }
    const freelancerId = contracts[0].freelancer_id;

    // 2. Fetch the Client's Escrow Balance
    const [userRows] = await connection.execute(
      "SELECT escrow_balance FROM users WHERE id = ?", [clientId]
    );
    const amountToRelease = Number(userRows[0].escrow_balance);

    // 3. Perform Money Transfer
    if (amountToRelease > 0) {
      await connection.execute(
        "UPDATE users SET balance = balance + ? WHERE id = ?", 
        [amountToRelease, freelancerId]
      );
      await connection.execute(
        "UPDATE users SET escrow_balance = escrow_balance - ? WHERE id = ?", 
        [amountToRelease, clientId]
      );
    }

    // 4. Finalize Statuses
    await connection.execute(
      "UPDATE contracts SET status = 'closed' WHERE id = ?", 
      [contractId]
    );
    
    await connection.execute(
      "UPDATE milestones SET status = 'completed' WHERE contract_id = ? AND status = 'funded'", 
      [contractId]
    );

    // --- NEW: NOTIFY FREELANCER OF COMPLETION ---
    const completionMsg = `Project successfully completed and settled!`;
    await connection.execute(
      "INSERT INTO notifications (user_id, type, content, link) VALUES (?, 'project_closed', ?, ?)",
      [freelancerId, completionMsg, `/contract/${contractId}`]
    );

    const io = req.app.get("socketio");
    if (io) {
      io.to(`user_${freelancerId}`).emit("new_notification", {
        type: 'project_closed',
        message: completionMsg
      });
    }

    await connection.commit();
    res.json({ success: true, message: "Project settled and closed!" });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("CRASH IN COMPLETE_PROJECT:", error.message);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// --- ADDITIONAL UTILITIES ---
export const getContractMilestones = async (req, res) => {
  const { id: contractId } = req.params;
  try {
    const [rows] = await db.execute(
      `SELECT id, title, amount, status, description, submission_details, 
              submitted_at, revision_notes FROM milestones 
       WHERE contract_id = ? ORDER BY created_at ASC`,
      [contractId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitContractWork = async (req, res) => {
  const { id: contractId } = req.params;
  const { milestoneId, details } = req.body; 
  try {
    await db.execute(
      `UPDATE milestones SET status = 'pending', submission_details = ?, submitted_at = NOW() 
       WHERE id = ? AND contract_id = ?`,
      [details, milestoneId, contractId]
    );
    res.json({ success: true, message: "Work submitted successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestMilestoneRevision = async (req, res) => {
  const { id: contractId } = req.params;
  const { milestoneId, notes } = req.body;
  try {
    await db.execute(
      `UPDATE milestones SET status = 'revision_requested', revision_notes = ? 
       WHERE id = ? AND contract_id = ?`,
      [notes, milestoneId, contractId]
    );
    res.json({ success: true, message: "Revision request sent." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMilestone = async (req, res) => {
  const { id: contractId } = req.params;
  const { title, amount, description } = req.body;
  const clientId = req.user.id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [user] = await connection.execute("SELECT balance FROM users WHERE id = ?", [clientId]);
    if (user[0].balance < amount) throw new Error("Insufficient balance");

    await connection.execute(
      "UPDATE users SET balance = balance - ?, escrow_balance = escrow_balance + ? WHERE id = ?",
      [amount, amount, clientId]
    );

    await connection.execute(
      "INSERT INTO milestones (contract_id, title, amount, status, description) VALUES (?, ?, ?, 'funded', ?)",
      [contractId, title, amount, description]
    );

    await connection.commit();
    res.status(201).json({ success: true, message: "Milestone added!" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

export const disputeMilestone = async (req, res) => {
  const { id: contractId } = req.params;
  const { milestoneId, reason } = req.body;
  const userId = req.user.id;

  try {
    const [contract] = await db.execute("SELECT client_id, freelancer_id FROM contracts WHERE id = ?", [contractId]);
    if (contract[0].client_id !== userId && contract[0].freelancer_id !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await db.execute(
      "UPDATE milestones SET status = 'disputed', revision_notes = ? WHERE id = ? AND contract_id = ?",
      [reason, milestoneId, contractId]
    );
    res.json({ success: true, message: "Dispute opened." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};