
const express = require("express");
const pool = require("./config/db");

const app = express();

app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "Todo API is running",
  });
});

// Test PostgreSQL connection
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.status(200).json({
      message: "PostgreSQL connected successfully",
      databaseTime: result.rows[0].now,
    });

  } catch (error) {
    console.error("Database query failed:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
