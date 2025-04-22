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
  const {adminId} = req.query;

  if (!adminId) {
    return res.status(400).json({ error: "Missing Admin Id" });
  }

  try{
    const result = await client.query(
      `SELECT * FROM ADMIN WHERE Admin_id = $1`,
      [adminId]
    );

    res.json(result)

  }
  catch(error){
    console.error("Unable to retrieve details:", err);
    res.status(500).json({ error: "Server error" });
  }

})

export default adminRouter;
