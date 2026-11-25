
import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.get("/", (_req, res) => {
  res.json({ 
    message: "Todo API is running",
  });
});

app.get("/db-test", async (_req, res) => {
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
