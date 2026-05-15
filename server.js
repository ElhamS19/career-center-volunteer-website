/* global process */
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
 
function splitFullName(name) {
  if (!name) return { firstName: "", lastName: "" };
  const parts = name.trim().split(/\s+/);
  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts[parts.length - 1] : "",
  };
}

function buildUserResponse(user) {
  const fullName = user.full_name || `${user.first_name || ""} ${user.last_name || ""}`.trim();
  const { firstName, lastName } = splitFullName(fullName);

  return {
    id: user.id,
    firstName: user.first_name || firstName,
    lastName: user.last_name || lastName,
    username: user.username || "",
    email: user.email,
    phone: user.phone || "",
    fullName: fullName || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
  };
}

let userColumnsCache;

async function getUserColumns() {
  if (userColumnsCache) {
    return userColumnsCache;
  }

  const [rows] = await db.execute(
    `SELECT COLUMN_NAME
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = ?
       AND TABLE_NAME = 'users'`,
    [process.env.DB_NAME]
  );

  userColumnsCache = new Set(rows.map((row) => row.COLUMN_NAME));
  return userColumnsCache;
}

function buildInsertStatement(tableName, data) {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  const columns = entries.map(([column]) => column);
  const values = entries.map(([, value]) => value);
  const placeholders = entries.map(() => "?").join(", ");

  return {
    sql: `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${placeholders})`,
    values,
  };
}

function buildUpdateStatement(tableName, data, whereClause, whereValues = []) {
  const entries = Object.entries(data).filter(([, value]) => value !== undefined);
  const assignments = entries.map(([column]) => `${column} = ?`).join(", ");
  const values = entries.map(([, value]) => value);

  return {
    sql: `UPDATE ${tableName} SET ${assignments} ${whereClause}`,
    values: [...values, ...whereValues],
  };
}

// database connection
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
 
// Signup route
app.post("/api/signup", async (req, res) => {
  const { firstName: rawFirstName, lastName: rawLastName, email, password, full_name } = req.body;
  const firstName = rawFirstName?.trim() || splitFullName(full_name).firstName;
  const lastName = rawLastName?.trim() || splitFullName(full_name).lastName;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const userColumns = await getUserColumns();
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`.trim();
    const username = `${firstName?.[0]?.toLowerCase() || ""}${lastName?.toLowerCase() || ""}`;
    const insertData = {
      email,
      password: hashedPassword,
      full_name: userColumns.has("full_name") ? fullName : undefined,
      first_name: userColumns.has("first_name") ? firstName : undefined,
      last_name: userColumns.has("last_name") ? lastName : undefined,
      username: userColumns.has("username") ? username : undefined,
    };
    const { sql, values } = buildInsertStatement("users", insertData);

    await db.execute(sql, values);

    res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});
 // Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }
 
  try {
    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
 
    if (rows.length === 0) {
      return res.status(401).json({ error: "No account found with that email." });
    }
 
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
 
    if (!match) {
      return res.status(401).json({ error: "Incorrect password." });
    }
 
    const { firstName, lastName } = splitFullName(user.full_name);

    res.status(200).json({
      message: "Login successful!",
      user: buildUserResponse(user),
    });
 
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Update profile route
app.post("/api/profile", async (req, res) => {
  const { userId, username, email, fullName, phone } = req.body;
  const normalizedUsername = username?.trim();
  const normalizedEmail = email?.trim();
  const normalizedFullName = fullName?.trim();
  const normalizedPhone = phone?.trim();

  if (!userId || !normalizedUsername || !normalizedEmail || !normalizedFullName) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const userColumns = await getUserColumns();
    const [currentUser] = await db.execute(
      "SELECT id FROM users WHERE id = ?",
      [userId]
    );

    if (currentUser.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    if (userColumns.has("username")) {
      const [usernameCheck] = await db.execute(
        "SELECT id FROM users WHERE username = ? AND id != ?",
        [normalizedUsername, userId]
      );

      if (usernameCheck.length > 0) {
        return res.status(409).json({ error: "Username already taken." });
      }
    }

    const [emailCheck] = await db.execute(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [normalizedEmail, userId]
    );

    if (emailCheck.length > 0) {
      return res.status(409).json({ error: "Email already in use." });
    }

    const { firstName, lastName } = splitFullName(normalizedFullName);
    const updateData = {
      email: normalizedEmail,
      full_name: userColumns.has("full_name") ? normalizedFullName : undefined,
      first_name: userColumns.has("first_name") ? firstName : undefined,
      last_name: userColumns.has("last_name") ? lastName : undefined,
      username: userColumns.has("username") ? normalizedUsername : undefined,
      phone: userColumns.has("phone") ? (normalizedPhone || null) : undefined,
    };
    const { sql, values } = buildUpdateStatement("users", updateData, "WHERE id = ?", [userId]);

    await db.execute(sql, values);

    res.status(200).json({
      message: "Profile updated successfully!",
      user: {
        id: userId,
        firstName,
        lastName,
        username: normalizedUsername,
        email: normalizedEmail,
        phone: userColumns.has("phone") ? (normalizedPhone || "") : "",
        fullName: normalizedFullName,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});
 
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
