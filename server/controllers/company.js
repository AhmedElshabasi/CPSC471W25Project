import express from "express";
import client from "../index.js";

const companyRouter = express.Router();

companyRouter.post("/add", async (req, res) => {
  const { name, location, phone } = req.body;

  if (!name || !location || !phone) {
    return res.status(400).json({ error: "Missing company fields" });
  }

  try {
    const result = await client.query(
      `INSERT INTO COMPANY (Company_name, Location, Phone_number)
         VALUES ($1, $2, $3)
         RETURNING *`,
      [name, location, phone]
    );

    res.status(201).json({ company: result.rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Company already exists" });
    }

    console.error("Add company error:", error);
    res.status(500).json({ error: "Server error while adding company" });
  }
});

export default companyRouter;
