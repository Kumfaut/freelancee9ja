import db from "../config/db.js";

// --- CREATE A NEW JOB ---
export const createJob = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ success: false, error: "User not authenticated" });
  }

  const client_id = req.user.id;
  const {
    title, description, budget_min, budget_max,
    location, state, skills, category, experience_level, duration
  } = req.body;

  try {
    const skillsString = Array.isArray(skills) ? skills.join(",") : (skills || "");

    const sql = `
      INSERT INTO jobs 
      (client_id, title, description, budget_min, budget_max, location, state, skills, category, experience_level, duration, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
    `;

    const [result] = await db.execute(sql, [
      client_id, title || "Untitled Job", description || "", 
      budget_min || 0, budget_max || 0, location || "Remote", 
      state || null, skillsString, category || "Other", 
      experience_level || "Intermediate", duration || "1 month"
    ]);

    return res.status(201).json({ 
      success: true,
      message: "Job created successfully", 
      jobId: result.insertId 
    });

  } catch (error) {
    console.error("SQL ERROR:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- GET ALL JOBS (Search & Filter) ---

export const getJobs = async (req, res) => {
  try {
    let sql = "SELECT * FROM jobs WHERE status = 'open'";
    const params = [];
    // Destructure params from req.query
    const { search, category, location, state, minBudget, maxBudget } = req.query;

    if (search && search.trim() !== "") {
      sql += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // ✨ FIX: Ensure we aren't filtering if category is "All" or empty string
    if (category && category !== "All" && category !== "" && category !== "all") {
      sql += " AND category = ?";
      params.push(category);
    }

    if (location && location !== "All" && location !== "all") {
      // Use exact match or LIKE depending on your UI
      sql += " AND location = ?"; 
      params.push(location);
    }

    if (state && state !== "All" && state !== "all") {
      sql += " AND state = ?";
      params.push(state);
    }

    // Budget filtering logic
    if (minBudget && !isNaN(minBudget)) {
      sql += " AND budget_min >= ?";
      params.push(Number(minBudget));
    }
    if (maxBudget && !isNaN(maxBudget)) {
      sql += " AND budget_max <= ?";
      params.push(Number(maxBudget));
    }

    sql += " ORDER BY created_at DESC";

    const [results] = await db.query(sql, params); // Use .query for standard arrays
    
    const jobs = results.map(job => ({
      ...job,
      skills: job.skills ? job.skills.split(",") : []
    }));
    
    return res.status(200).json({ success: true, data: jobs });
  } catch (error) {
    console.error("GET_JOBS_ERROR:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// --- GET SINGLE JOB BY ID ---
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id; // Get the logged-in user's ID

    // 1. Fetch the Job Details
    const [rows] = await db.query("SELECT * FROM jobs WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const job = rows[0];
    job.skills = job.skills ? job.skills.split(",") : [];

    // 2. Check if this specific user has already applied
    let hasApplied = false;
    if (userId) {
      const [proposal] = await db.query(
        "SELECT id FROM proposals WHERE job_id = ? AND freelancer_id = ?",
        [id, userId]
      );
      hasApplied = proposal.length > 0;
    }

    // 3. Return both the job data and the application status
    res.status(200).json({ 
      success: true, 
      data: { ...job, hasApplied } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- SUBMIT PROPOSAL (Fixed Column Names & ESLint) ---
export const submitProposal = async (req, res) => {
  try {
    const { job_id, bid_amount, delivery_days, cover_letter } = req.body;
    const freelancer_id = req.user.id;

    // Use [result] only if you need to access result.insertId
    const [result] = await db.query(
      "INSERT INTO proposals (job_id, freelancer_id, bid_amount, delivery_days, cover_letter, status) VALUES (?, ?, ?, ?, ?, 'pending')",
      [job_id, freelancer_id, bid_amount, delivery_days, cover_letter]
    );

    res.status(201).json({ 
      success: true, 
      message: "Proposal sent!", 
      proposalId: result.insertId // Using result here satisfies ESLint
    });
  } catch (error) {
    console.error("SUBMIT PROPOSAL ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- GET CLIENT'S OWN JOBS ---
// --- GET CLIENT'S OWN JOBS ---
export const getMyJobs = async (req, res) => {
  try {
    const clientId = req.user.id; 
    
    // We JOIN with contracts to get the contract ID for 'filled' jobs
    const sql = `
      SELECT 
        j.*, 
        c.id AS contract_id 
      FROM jobs j
      LEFT JOIN contracts c ON j.id = c.job_id
      WHERE j.client_id = ? 
      ORDER BY j.created_at DESC
    `;

    const [results] = await db.query(sql, [clientId]);

    const jobs = results.map(job => ({
      ...job,
      skills: job.skills ? job.skills.split(",") : []
    }));

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("getMyJobs Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// --- UPDATE A JOB ---
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id; 
  
  try {
    const {
      title, description, budget_min, budget_max,
      location, state, skills, category, experience_level, duration
    } = req.body;

    const skillsString = Array.isArray(skills) ? skills.join(",") : (skills || "");
    
    const sql = `
      UPDATE jobs 
      SET title = ?, description = ?, budget_min = ?, budget_max = ?, location = ?, 
          state = ?, skills = ?, category = ?, experience_level = ?, duration = ?
      WHERE id = ? AND client_id = ?
    `;

    const [result] = await db.execute(sql, [
      title, description, budget_min, budget_max, location, 
      state, skillsString, category, experience_level, duration, id, clientId
    ]);

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Unauthorized or job not found" });
    }
    
    return res.status(200).json({ message: "Job updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// --- DELETE A JOB ---
export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const clientId = req.user.id;
  try {
    const [result] = await db.execute("DELETE FROM jobs WHERE id = ? AND client_id = ?", [id, clientId]);
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: "Unauthorized or job not found" });
    }
    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// backend/controllers/jobController.js
export const getCategoryStats = async (req, res) => {
  try {
    // Assuming you are using mysql2/promise
    const [rows] = await db.execute(
      `SELECT category, COUNT(*) as count 
       FROM jobs 
       GROUP BY category`
    );
    
    res.status(200).json({
      success: true,
      data: rows // This returns [{category: 'Web Development', count: 5}, ...]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this to your job controller/routes
// backend/controllers/jobController.js
export const getLatestJobs = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM jobs ORDER BY created_at DESC LIMIT 5"
    );
    // Return in a consistent success/data format
    res.json({ success: true, data: rows }); 
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// backend/src/controllers/jobController.js

// backend/src/controllers/jobController.js
export const getSavedJobs = async (req, res) => {
  const user_id = req.user.id;
  try {
    const sql = `
      SELECT 
        j.id, 
        j.title, 
        j.category, 
        j.budget_max, 
        j.location, 
        j.experience_level, 
        j.created_at 
      FROM saved_jobs sj
      INNER JOIN jobs j ON sj.job_id = j.id
      WHERE sj.user_id = ?
      ORDER BY sj.created_at DESC
    `;
    const [rows] = await db.execute(sql, [user_id]);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
// --- TOGGLE SAVE/UNSAVE JOB ---
export const toggleSaveJob = async (req, res) => {
  const user_id = req.user.id;
  const { job_id } = req.body; // Ensure frontend sends { job_id: ... }

  try {
    // Use ? placeholders to prevent injection and handle types correctly
    const [existing] = await db.execute(
      "SELECT * FROM saved_jobs WHERE user_id = ? AND job_id = ?",
      [user_id, job_id]
    );

    if (existing.length > 0) {
      await db.execute("DELETE FROM saved_jobs WHERE user_id = ? AND job_id = ?", [user_id, job_id]);
      return res.json({ success: true, saved: false, message: "Job removed" });
    } else {
      await db.execute("INSERT INTO saved_jobs (user_id, job_id) VALUES (?, ?)", [user_id, job_id]);
      return res.json({ success: true, saved: true, message: "Job saved!" });
    }
  } catch (error) {
    // If there is a Foreign Key constraint error, it will show up here
    console.error("SQL Error in toggleSaveJob:", error); 
    res.status(500).json({ success: false, error: error.message });
  }
};

// backend/controllers/jobController.js

// backend/controllers/jobController.js
export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get the user's skills from their profile
    const [userRows] = await db.execute(
      "SELECT skills FROM users WHERE id = ?", 
      [userId]
    );

    const rawSkills = userRows[0]?.skills;

    // 2. If user has no skills set, just return the 3 latest jobs
    if (!rawSkills) {
      const [latest] = await db.execute(
        "SELECT * FROM jobs WHERE status = 'open' ORDER BY created_at DESC LIMIT 3"
      );
      return res.json({ success: true, data: latest });
    }

    // 3. Matchmaker Logic: Clean the skills and build the SQL query
    const userSkills = rawSkills.split(',').map(s => s.trim()).filter(s => s !== "");

    // We look for jobs where the skill string contains any of the user's skills
    let sql = "SELECT * FROM jobs WHERE status = 'open' AND (";
    const skillParts = userSkills.map(() => "skills LIKE ?").join(" OR ");
    sql += skillParts + ") ORDER BY created_at DESC LIMIT 3";

    const params = userSkills.map(skill => `%${skill}%`);

    const [recommended] = await db.execute(sql, params);
    
    res.json({ success: true, data: recommended });
  } catch (error) {
    console.error("RECOMMENDED_ERR:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};