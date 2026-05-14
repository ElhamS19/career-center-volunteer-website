import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import { readFileSync } from "fs";
import { resolve } from "path";
 
const app = express();
app.use(cors());
app.use(express.json());
 
/* ── Database connection ── */
const ca = readFileSync(resolve("ca.pem"));
 
const db = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca,
    rejectUnauthorized: false,
  },
});
 
console.log("✅ Connected to Aiven MySQL!");
 
/* ── Sign Up route ── */
app.post("/api/signup", async (req, res) => {
  const { full_name, email, password } = req.body;
 
  if (!full_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
 
  try {
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
 
    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
 
    await db.execute(
      "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
      [full_name, email, hashedPassword]
    );
 
    res.status(201).json({ message: "Account created successfully!" });
 
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});
 
/* ── Start server ── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});