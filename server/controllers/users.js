import express from "express";
import client from "../index.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_super_secret_key";

const userRouter = express.Router();

// Create a new user
userRouter.post("/", async (req, res, next) => {
  const { username, firstname, lastname, email, password, phonenum } = req.body;

  if (!username || !password || !firstname || !lastname || !phonenum) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await client.query(
      `INSERT INTO CUSTOMER (First_name, Last_name, Email_address, Username, Phone_number, Password) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING Username, First_name, Last_name, Email_address, Phone_number`,
      [firstname, lastname, email, username, phonenum, password]
    );

    const user = result.rows[0];

    // Sign a JWT
    const token = jwt.sign({ username: user.username }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "Username already exists" });
    } else {
      next(error);
    }
  }
});

// Update user profile
userRouter.put("/", async (request, response, next) => {
  const { username, firstname, lastname, email, phonenum } = request.body;

  if (!username || !firstname || !lastname || !email || !phonenum) {
    return response.status(400).json({ error: "Missing required fields" });
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
      return response.status(404).json({ error: "User not found" });
    }

    response.status(200).json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

// Delete user account
userRouter.delete("/", async (request, response, next) => {
  const { username } = request.body;

  if (!username) {
    return response.status(400).json({ error: "Username is required" });
  }

  try {
    const result = await client.query(
      `DELETE FROM CUSTOMER WHERE Username = $1 RETURNING *`,
      [username]
    );

    if (result.rowCount === 0) {
      return response.status(404).json({ error: "User not found" });
    }

    response.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await client.query("SELECT * FROM CUSTOMER WHERE Username = $1 AND Password = $2", [
    username,
    password,
  ]);

  if (result.rowCount === 0) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const user = result.rows[0];
  const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ token, user });
});




export default userRouter;