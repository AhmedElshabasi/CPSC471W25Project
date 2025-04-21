import express from "express";
import client from "../index.js";

const theatreRouter = express.Router();

// Set up a router for GET requests on /api/movies/theatre
theatreRouter.get("/", async (req, res) => {
  const location = req.query;

  try {
    const response = await client.query(
      `SELECT * FROM THEATRE WHERE LOCATION LIKE $1`,
      location
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "No such theatres found." });
  }
});

theatreRouter.get("/details", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM THEATRE`);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "No such theatres found." });
  }
});

theatreRouter.post("/add/theatre", async (req, res) => {
  const { location, phone, company } = req.body;

  if (!location || !phone || !company) {
    return res.status(400).json({ error: "Missing theatre fields" });
  }

  try {
    const result = await client.query(
      `INSERT INTO THEATRE (Location, Phone_number, Company_name)
           VALUES ($1, $2, $3)
           RETURNING *`,
      [location, phone, company]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Add theatre error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

theatreRouter.delete("/delete/theatre", async (req, res) => {
  const { location, companyName } = req.body;

  if (!location || !companyName) {
    return res
      .status(400)
      .json({ error: "Theatre location and company name are required." });
  }

  try {
    const result = await client.query(
      `DELETE FROM THEATRE WHERE Location = $1 AND Company_name = $2 RETURNING *`,
      [location, companyName]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Theatre not found." });
    }

    res.status(200).json({ message: "Theatre deleted successfully." });
  } catch (error) {
    console.error("Delete theatre error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

theatreRouter.put("/update/theatre", async (req, res) => {
  const { location, new_phone, new_company } = req.body;

  if (!location || !new_phone || !new_company) {
    return res.status(400).json({ error: "Missing required theatre fields" });
  }

  try {
    const result = await client.query(
      `UPDATE THEATRE
         SET Phone_number = $1,
             Company_name = $2
         WHERE Location = $3
         RETURNING *`,
      [new_phone, new_company, location]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Theatre not found" });
    }

    res.status(200).json({ theatre: result.rows[0] });
  } catch (error) {
    console.error("Update theatre error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default theatreRouter;
