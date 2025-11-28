import db from "./db.js";

const testConnection = async () => {
  try {
    // Test simple query
    const [users] = await db.query("SELECT * FROM users LIMIT 1");
    const [jobs] = await db.query("SELECT * FROM jobs LIMIT 1");
    const [transactions] = await db.query("SELECT * FROM transactions LIMIT 1");

    console.log("✅ Users table sample:", users);
    console.log("✅ Jobs table sample:", jobs);
    console.log("✅ Transactions table sample:", transactions);

    console.log("✅ Database connection and tables are working!");
  } catch (err) {
    console.error("❌ Database test failed:", err.message);
  } finally {
    process.exit();
  }
};

testConnection();
