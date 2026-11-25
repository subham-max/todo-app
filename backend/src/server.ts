
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("../src/config/db.js").default;
const authRoutes = require("./routes/auth.routes.js").default;

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (req:any, res:any) => {
  res.json({ 
    message: "Todo API is running",
  });
});

app.get("/db-test", async (req:any, res:any) => {
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

const PORT = Number(process.env.PORT) || 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
