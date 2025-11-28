import db from "../config/db.js";

// Create a new job
export const createJob = (req, res) => {
  const {
    title,
    description,
    budget_min,
    budget_max,
    location,
    state,
    skills,
    category,
    experience_level,
    duration
  } = req.body;

  const skillsString = skills.join(","); // store skills as comma-separated string

  const sql = `
    INSERT INTO jobs 
    (title, description, budget_min, budget_max, location, state, skills, category, experience_level, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, budget_min, budget_max, location, state, skillsString, category, experience_level, duration], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Job created successfully", jobId: result.insertId });
  });
};

// Get all jobs (with optional filters)
export const getJobs = (req, res) => {
  let sql = "SELECT * FROM jobs WHERE 1=1";
  const params = [];

  const { category, location, state, minBudget, maxBudget } = req.query;

  if (category) {
    sql += " AND category = ?";
    params.push(category);
  }

  if (location) {
    sql += " AND location LIKE ?";
    params.push(`%${location}%`);
  }

  if (state) {
    sql += " AND state = ?";
    params.push(state);
  }

  if (minBudget) {
    sql += " AND budget_min >= ?";
    params.push(minBudget);
  }

  if (maxBudget) {
    sql += " AND budget_max <= ?";
    params.push(maxBudget);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    // Convert skills from string to array
    const jobs = results.map(job => ({ ...job, skills: job.skills.split(",") }));
    res.json(jobs);
  });
};

// Get a single job by ID
export const getJobById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM jobs WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Job not found" });
    const job = { ...results[0], skills: results[0].skills.split(",") };
    res.json(job);
  });
};

// Update a job
export const updateJob = (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    budget_min,
    budget_max,
    location,
    state,
    skills,
    category,
    experience_level,
    duration
  } = req.body;

  const skillsString = skills.join(",");

  const sql = `
    UPDATE jobs 
    SET title = ?, description = ?, budget_min = ?, budget_max = ?, location = ?, state = ?, skills = ?, category = ?, experience_level = ?, duration = ?
    WHERE id = ?
  `;

  db.query(sql, [title, description, budget_min, budget_max, location, state, skillsString, category, experience_level, duration, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Job updated successfully" });
  });
};

// Delete a job
export const deleteJob = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM jobs WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Job deleted successfully" });
  });
};
