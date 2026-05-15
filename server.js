/* global process */
import "dotenv/config";
import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { readFileSync } from "fs";
import { resolve } from "path";

const app = express();
app.use(cors());
app.use(express.json());
 
const passwordResetCodes = new Map();
const verifiedResetEmails = new Set();
 
function generateResetCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}
 
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
 
function storeResetCode(email, code) {
  passwordResetCodes.set(email, {
    code,
    expiresAt: Date.now() + 10 * 60 * 1000,
  });
}
 
function cleanupResetCode(email) {
  passwordResetCodes.delete(email);
  verifiedResetEmails.delete(email);
}
 
function getEmailTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
 
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}
 
async function sendResetCodeEmail(email, code) {
  const transporter = getEmailTransporter();
  const subject = "Your Sac State Career Center password reset code";
  const text = `Your password reset code is ${code}. Enter this code in the app to proceed.`;
  const html = `<p>Your password reset code is <strong>${code}</strong>.</p><p>Enter this code in the app to continue.</p>`;
 
  if (!transporter) {
    console.log(`Password reset code for ${email}: ${code}`);
    return;
  }
 
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject,
    text,
    html,
  });
}
 
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

// Change password route
app.post("/api/password/change", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: "Current password and new password are required." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, password FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = rows[0];
    const currentPasswordMatches = await bcrypt.compare(currentPassword, user.password);

    if (!currentPasswordMatches) {
      return res.status(401).json({ error: "Current password is incorrect." });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({ error: "Choose a password you have not used for this account." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, userId]
    );

    res.status(200).json({ message: "Your password has been updated." });
  } catch (err) {
    console.error("Password change error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Request password reset code route
app.post("/api/password/request-reset", async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = email?.trim();

  if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No account found with that email." });
    }

    const code = generateResetCode();
    storeResetCode(normalizedEmail, code);

    try {
      await sendResetCodeEmail(normalizedEmail, code);
    } catch (error) {
      console.error("Send reset code error:", error);
      return res.status(500).json({ error: "Unable to send the reset code email. Please try again later." });
    }

    res.status(200).json({ message: "A 6-digit reset code has been sent to your email." });
  } catch (err) {
    console.error("Request reset code error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// Verify reset code route
app.post("/api/password/verify-reset-code", async (req, res) => {
  const { email, code } = req.body;
  const normalizedEmail = email?.trim();
  const normalizedCode = String(code || "").trim();

  if (!normalizedEmail || !isValidEmail(normalizedEmail) || !/^\d{6}$/.test(normalizedCode)) {
    return res.status(400).json({ error: "A valid email and 6-digit code are required." });
  }

  const entry = passwordResetCodes.get(normalizedEmail);

  if (!entry) {
    return res.status(400).json({ error: "No reset code request found for that email." });
  }

  if (Date.now() > entry.expiresAt) {
    cleanupResetCode(normalizedEmail);
    return res.status(400).json({ error: "The reset code has expired. Please request a new one." });
  }

  if (entry.code !== normalizedCode) {
    return res.status(400).json({ error: "The code entered is invalid. Please check your email." });
  }

  passwordResetCodes.delete(normalizedEmail);
  verifiedResetEmails.add(normalizedEmail);

  res.status(200).json({ message: "The code has been verified. You can now reset your password." });
});

// Reset password route
app.post("/api/password/reset", async (req, res) => {
  const { email, newPassword } = req.body;
  const normalizedEmail = email?.trim();

  if (!normalizedEmail || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required." });
  }

  if (!verifiedResetEmails.has(normalizedEmail)) {
    return res.status(403).json({ error: "Please verify the reset code before changing your password." });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: "New password must be at least 6 characters." });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, password FROM users WHERE email = ?",
      [normalizedEmail]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No account found with that email." });
    }

    const user = rows[0];
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({ error: "Choose a password you have not used for this account." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, user.id]
    );

    cleanupResetCode(normalizedEmail);
    verifiedResetEmails.delete(normalizedEmail);

    res.status(200).json({ message: "Your password has been reset." });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});
 
// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
