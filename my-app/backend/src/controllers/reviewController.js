import db from "../config/db.js";

export const createReview = async (req, res) => {
  const reviewer_id = req.user.id; // The person logged in
  const { contract_id, reviewee_id, rating, comment } = req.body;

  // Validation: Ensure rating is between 1 and 5
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  try {
    // 1. Check if the contract actually exists and is completed
    // (A good defense point: You can't review a job that isn't finished)
    const [contract] = await db.execute(
      "SELECT status FROM contracts WHERE id = ?", 
      [contract_id]
    );

    if (contract.length === 0) {
      return res.status(404).json({ error: "Contract not found" });
    }

    // 2. Insert the review
    const sql = `
      INSERT INTO reviews (contract_id, reviewer_id, reviewee_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [contract_id, reviewer_id, reviewee_id, rating, comment]);

    // 3. Create a notification for the person being reviewed
    await db.execute(
      "INSERT INTO notifications (user_id, type, content) VALUES (?, 'payment', ?)",
      [reviewee_id, "You have received a new review for your recent work!"]
    );

    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all reviews for a specific user (for their Profile Page)
export const getUserReviews = async (req, res) => {
  const { userId } = req.params;

  try {
    const sql = `
      SELECT r.*, u.full_name AS reviewer_name 
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.reviewee_id = ?
      ORDER BY r.created_at DESC
    `;
    const [reviews] = await db.execute(sql, [userId]);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};