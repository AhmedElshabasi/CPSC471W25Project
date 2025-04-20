import express from "express";
import client from "../index.js";
import jwt from "jsonwebtoken";

const adminRouter = express.Router();
const JWT_SECRET = "your_super_secret_key";

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

adminRouter.get("/details", async (req, res) => {
  const { adminId } = req.query;

  if (!adminId) {
    return res.status(400).json({ error: "Missing Admin Id" });
  }

  try {
    const result = await client.query(
      `SELECT * FROM ADMIN WHERE Admin_id = $1`,
      [adminId]
    );

    res.json(result);
  } catch (error) {
    console.error("Unable to retrieve details:", err);
    res.status(500).json({ error: "Server error" });
  }
});

adminRouter.post("/add/admin", async (req, res) => {
  const { admin_id, role, permissions, username, phone, password } = req.body;

  if (!admin_id || !role || !permissions || !username || !phone || !password) {
    return res.status(400).json({ error: "Missing admin fields" });
  }

  try {
    const result = await client.query(
      `INSERT INTO ADMIN (Admin_id, Role, Permissions, Username, Phone_number, Password)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
      [admin_id, role, permissions, username, phone, password]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

adminRouter.delete("/delete/admin", async (req, res) => {
  const { admin_id } = req.body;

  if (!admin_id) {
    return res.status(400).json({ error: "Admin ID is required." });
  }

  try {
    const result = await client.query(
      `DELETE FROM ADMIN WHERE Admin_Id = $1 RETURNING *`,
      [admin_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Admin not found." });
    }

    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

adminRouter.put("/update/admin", async (req, res) => {
  const { admin_id, new_role, new_permissions, new_phone } = req.body;

  if (!admin_id || !new_role || !new_permissions || !new_phone) {
    return res.status(400).json({ error: "Missing required admin fields" });
  }

  try {
    const result = await client.query(
      `UPDATE ADMIN
         SET Role = $1,
             Permissions = $2,
             Phone_number = $3
         WHERE Admin_Id = $4
         RETURNING *`,
      [new_role, new_permissions, new_phone, admin_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({ admin: result.rows[0] });
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default adminRouter;
