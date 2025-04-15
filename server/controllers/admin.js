import express from "express";
import client from "../index.js";
import jwt from "jsonwebtoken";

const adminRouter = express.Router();
const JWT_SECRET = "your_super_secret_key";

// Insert a default admin for testing
const insertDefaultAdmin = async () => {
  try {
    await client.query(
      `INSERT INTO ADMIN (Admin_Id, Role, Permissions, Username, Phone_number, Password)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING Admin_Id, Role, Permissions, Username, Phone_number, Password`,
      [1, "MANAGER", "FULL_ACCESS", "admin", "1234567890", "password123"]
    );
    console.log("Default admin inserted");
  } catch (error) {
    console.error("Error inserting default admin:", error);
  }
};

insertDefaultAdmin();

// Admin login route
adminRouter.post("/auth/login", async (req, res) => {
  const { username, phonenum, password } = req.body;

  if (!username || !phonenum || !password) {
    return res.status(400).json({ error: "Missing credentials" });
  }

  try {
    const result = await client.query(
      `SELECT * FROM ADMIN WHERE Username = $1 AND Phone_number = $2 AND Password = $3`,
      [username, phonenum, password]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }

    const admin = result.rows[0];
    const token = jwt.sign(
      { adminId: admin.admin_id, username: admin.username },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({ token, admin });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default adminRouter;
