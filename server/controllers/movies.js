import express from "express";
import dotenv from "dotenv";
import client from "../index.js";

const movieRouter = express.Router();

// Set up a router for GET requests on /api/movies/movies
movieRouter.get("/movies", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM MOVIE`);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "No movies in the database." });
  }
});

movieRouter.post("/movie", async (req, res) => {
  const { movieName } = req.body;
  try {
    const result = await client.query(`SELECT * FROM MOVIE WHERE Name = $1`, [
      movieName,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "No such movie in database." });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Could not retrieve movie from database." });
  }
});

export default movieRouter;
