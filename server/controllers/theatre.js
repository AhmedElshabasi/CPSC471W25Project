import express from "express";
import client from "../index.js"

const theatreRouter = express.Router();

// Set up a router for GET requests on /api/movies/theatre
theatreRouter.get("/", async (req, res) => {
  const location = req.query

  try {
    const response = await client.query(`SELECT * FROM THEATRE WHERE LOCATION LIKE $1`, location)
    res.json(response)
    
  } catch (error) {
    res.status(500).json({ error: "No such theatres found." });
  }
});

theatreRouter.get("/find", async (req, res) => {
  const {location, company} = req.query
  console.log(location, company)

  // Use ILIKE for case insentitive
  try {
    const response = await client.query(`SELECT * FROM THEATRE WHERE LOCATION ILIKE $1 AND COMPANY_NAME = $2`, [`%${location}%`, company])
    res.json(response)

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "No such theatres found." });
  }
});

theatreRouter.get("/details", async (req, res) => {

  try {
    const response = await client.query(`SELECT * FROM THEATRE`)
    res.json(response)
    
  } catch (error) {
    res.status(500).json({ error: "No such theatres found." });
  }
});

export default theatreRouter;