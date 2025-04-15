import express from "express";
import dotenv from "dotenv";
import client from "../index.js"

const movieRouter = express.Router();

// Set up a router for GET requests on /api/movies/movies
movieRouter.get("/movies", async (req, res) => {
  try {
    const response = await client.query(`SELECT * FROM MOVIE`)
    res.json(response)
    
  } catch (error) {
    res.status(500).json({ error: "No movies in the database." });
  }
});

export default movieRouter;