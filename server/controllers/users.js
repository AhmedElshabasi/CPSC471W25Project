import express from "express";
import client from "../index.js";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../utils/middleware.js";
import bcrypt from "bcrypt";

const JWT_SECRET = "your_super_secret_key";

const userRouter = express.Router();

// Create a new user
userRouter.post("/", async (req, res, next) => {
  let { username, firstname, lastname, email, password, phonenum } = req.body;

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;

  // === Required Fields ===
  if (!username || !password || !firstname || !lastname || !phonenum) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  // === Username validation ===
  if (/\s/.test(username) || username.length > 16) {
    return res.status(400).json({
      error: "Username must not contain spaces and must be 16 characters or less.",
    });
  }

  // === Password validation ===
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one special character.",
    });
  }

  // === Email validation ===
  if (email && !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  // === Phone number validation ===
  if (!phoneRegex.test(phonenum)) {
    return res.status(400).json({
      error: "Phone number must be in the format 1234567890 or 123-456-7890.",
    });
  }

  // Normalize phone number to 123-456-7890
  phonenum = phonenum.replace(/-/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

  // === First and last name length ===
  if (firstname.length > 16) {
    return res.status(400).json({ error: "First name must be 16 characters or less." });
  }

  if (lastname.length > 16) {
    return res.status(400).json({ error: "Last name must be 16 characters or less." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      `INSERT INTO CUSTOMER (First_name, Last_name, Email_address, Username, Phone_number, Password) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING Customer_id, Username, First_name, Last_name, Email_address, Phone_number`
      [firstname.trim(), lastname.trim(), email.trim(), username.trim(), phonenum, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign({ username: user.username, customer_id: user.customer_id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === "23505") {
      const constraint = error.constraint || "";
      if (constraint.includes("username")) {
        return res.status(409).json({ error: "Username already exists." });
      } else if (constraint.includes("phone")) {
        return res.status(409).json({ error: "Phone number already in use." });
      } else {
        return res.status(409).json({ error: "Duplicate value detected." });
      }
    } else {
      console.error("Signup error:", error);
      return next(error);
    }
  }
});

// Update user profile
userRouter.put("/", authenticateToken, async (req, res, next) => {
  const { firstname, lastname, email, phonenum } = req.body;
  const username = req.user.username;

  if (!firstname || !lastname || !email || !phonenum) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await client.query(
      `UPDATE CUSTOMER
       SET First_name = $1,
           Last_name = $2,
           Email_address = $3,
           Phone_number = $4
       WHERE Username = $5
       RETURNING First_name, Last_name, Email_address, Username, Phone_number`,
      [firstname, lastname, email, phonenum, username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Delete user account
userRouter.delete("/", authenticateToken, async (req, res, next) => {
  const username = req.user.username;

  try {
    const result = await client.query(
      `DELETE FROM CUSTOMER WHERE Username = $1 RETURNING *`,
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

// log in into user account
userRouter.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await client.query("SELECT * FROM CUSTOMER WHERE Username = $1", [username]);

  if (result.rowCount === 0) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const user = result.rows[0];

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign({ username: user.username, customer_id: user.customer_id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user });
});

// Get current logged-in user's full profile
userRouter.get("/profile", authenticateToken, async (req, res) => {
  const username = req.user.username;

  try {
    const result = await client.query(
      `SELECT Username, First_name, Last_name, Email_address, Phone_number
       FROM CUSTOMER
       WHERE Username = $1`,
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    res.json({
      username: user.username,
      firstname: user.first_name,
      lastname: user.last_name,
      email: user.email_address,
      phonenum: user.phone_number,
    });
  } catch (err) {
    console.error("Error retrieving user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

userRouter.post("/change-password", authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.user.username;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new password are required" });
  }

  try {
    // Get the current hashed password from the DB
    const result = await client.query(
      `SELECT Password FROM CUSTOMER WHERE Username = $1`,
      [username]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const storedHashedPassword = result.rows[0].password;

    // Check if the currentPassword matches the hashed one
    const match = await bcrypt.compare(currentPassword, storedHashedPassword);
    if (!match) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash the new password
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the DB
    await client.query(
      `UPDATE CUSTOMER SET Password = $1 WHERE Username = $2`,
      [newHashedPassword, username]
    );

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});




export default userRouter;