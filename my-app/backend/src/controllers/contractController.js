import db from "../config/db.js";

// --- 1. HIRE FREELANCER ---
export const hireFreelancer = async (req, res) => {
  // Now using proposal_id below
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

    // 4. FIX ESLINT ERROR: Use proposal_id to update the proposal status
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

// --- 4. SUBMIT WORK (Renamed to match your Route) ---
export const submitContractWork = async (req, res) => {
  const { id: contractId } = req.params;
  try {
    await db.execute(
      "UPDATE contracts SET status = 'completed' WHERE id = ?",
      [contractId]
    );
    res.json({ success: true, message: "Work submitted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 5. RELEASE MILESTONE ---
export const releaseMilestone = async (req, res) => {
  const { id: contractId } = req.params;
  const { milestoneId } = req.body;
  const clientId = req.user.id;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Check if contract exists and belongs to client
    const [contract] = await connection.execute(
      "SELECT freelancer_id FROM contracts WHERE id = ? AND client_id = ?",
      [contractId, clientId]
    );

    if (contract.length === 0) {
      return res.status(404).json({ success: false, message: "Contract not found" });
    }

    // 2. Check if milestone exists
    const [milestone] = await connection.execute(
      "SELECT amount FROM milestones WHERE id = ? AND contract_id = ?",
      [milestoneId, contractId]
    );

    if (milestone.length === 0) {
      return res.status(404).json({ success: false, message: "Milestone not found" });
    }

    const amount = milestone[0].amount;
    const freelancerId = contract[0].freelancer_id;

    // 3. Perform the money move
    await connection.execute("UPDATE milestones SET status = 'completed' WHERE id = ?", [milestoneId]);
    await connection.execute("UPDATE users SET balance = balance + ? WHERE id = ?", [amount, freelancerId]);
    await connection.execute("UPDATE users SET escrow_balance = escrow_balance - ? WHERE id = ?", [amount, clientId]);

    // 4. Log Transaction
    await connection.execute(
      "INSERT INTO transactions (user_id, amount, type, status, description) VALUES (?, ?, 'payment_received', 'completed', 'Milestone Payment')",
      [freelancerId, amount]
    );

    await connection.commit();
    res.json({ success: true, message: "Payment released!" });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

export const requestMilestoneRevision = async (req, res) => {
  const { id: contractId } = req.params;
  const { milestoneId, notes } = req.body;
  const clientId = req.user.id;

  try {
    // Verify client owns the contract
    const [contract] = await db.execute(
      "SELECT id FROM contracts WHERE id = ? AND client_id = ?",
      [contractId, clientId]
    );

    if (contract.length === 0) return res.status(403).json({ message: "Unauthorized" });

    await db.execute(
      "UPDATE milestones SET status = 'revision_requested', revision_notes = ? WHERE id = ?",
      [notes, milestoneId]
    );

    res.json({ success: true, message: "Revision requested successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};