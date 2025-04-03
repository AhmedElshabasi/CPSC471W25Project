import express from "express";
import client from "../index.js";

const userRouter = express.Router();

// Create a new user
userRouter.post("/", async (request, response, next) => {
  const { username, firstname, lastname, email, password } =
    request.body;
  let phonenum = request.body.phonenum;

  // Validate required fields
  if (!username || !password || !firstname || !lastname || !phonenum) {
    return response.status(400).json({ error: "Missing required fields" });
  }

  try {

    // Insert the user into the database
    const result = await client.query(
      `INSERT INTO CUSTOMER (First_name, Last_name, Email_address, Username, Phone_number, Password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING First_name, Last_name, Email_address, Username, Phone_number, Password`,
      [
        firstname,
        lastname,
        email,
        username,
        phonenum,
        password,
      ]
    );

    // Return the created user (excluding sensitive fields like password)
    response.status(201).json({ user: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      // Handle unique constraint violations (e.g., duplicate username)
      response
        .status(409)
        .json({ error: "Username already exists" });
    } else {
      next(error); // Pass other errors to the error handler
    }
  }
});