import express from "express";
import dotenv from "dotenv";
dotenv.config();
import client from "../index.js";

const API_KEY = process.env.TMDB_API_KEY;
const movieRouter = express.Router();

// Set up a router for GET requests on /api/movies/movies to get movies from database
movieRouter.get("/movies", async (req, res) => {
  try {
    // Select all movie details
    const response = await client.query(`SELECT * FROM MOVIE`);
    return await res.json(response);
  } catch (error) {
    res.status(500).json({ error: "No movies in the database." });
  }
});

// Set up a router for GET requests on api/movies/image to get the images for each movieId
movieRouter.get("/movies/image", async (req, res) => {
  try {
    // Retrieve the request query
    const { movie_id } = req.query;

    // Fetch from the image from the API
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=${API_KEY}`
    );
    const imageURL = "https://image.tmdb.org/t/p/w342/";
    const data = await response.json();

    // Send the image url as a JSON
    res.json(imageURL + data.posters[0].file_path);
  } catch (error) {
    console.error("Unable to fetch Movie image", error);
    res.status(500).json({ error: "Unable to fetch Movie image" });
  }
});

movieRouter.post("/add/movie", async (req, res) => {
  const { name, movie_id, genre, pg_rating, release_date, description } =
    req.body;

  if (
    !name ||
    !movie_id ||
    !genre ||
    !pg_rating ||
    !release_date ||
    !description
  ) {
    return res.status(400).json({ error: "Missing movie fields" });
  }

  try {
    const result = await client.query(
      `INSERT INTO MOVIE (Name, Movie_id, Genre, PG_rating, Release_date, Description, Duration, End_time, Start_time)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING *`,
      [
        name,
        movie_id,
        genre,
        pg_rating,
        release_date,
        description,
        "00:00:00",
        "00:00:00",
        "00:00:00",
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Add movie error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

movieRouter.get("/actors", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM MOVIE_ACTOR");
    res.status(200).json(result);
  } catch (error) {
    console.error("Fetch movie actors error:", error);
    res.status(500).json({ error: "Failed to retrieve movie actors" });
  }
});

movieRouter.post("/add/actor", async (req, res) => {
  const { name, actor } = req.body;

  if (!name || !actor) {
    return res.status(400).json({ error: "Missing movie or actor name" });
  }

  try {
    const result = await client.query(
      `INSERT INTO MOVIE_ACTOR (Name, Actor)
           VALUES ($1, $2)
           RETURNING *`,
      [name, actor]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Add actor error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

movieRouter.delete("/delete/movie", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Movie name is required." });
  }

  try {
    const result = await client.query(
      `DELETE FROM MOVIE WHERE Name = $1 RETURNING *`,
      [name]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found." });
    }

    res.status(200).json({ message: "Movie deleted successfully." });
  } catch (error) {
    console.error("Delete movie error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

movieRouter.delete("/delete/actor", async (req, res) => {
  const { name, actor } = req.body;

  if (!name || !actor) {
    return res
      .status(400)
      .json({ error: "Movie name and actor name are required." });
  }

  try {
    const result = await client.query(
      `DELETE FROM MOVIE_ACTOR WHERE Name = $1 AND Actor = $2 RETURNING *`,
      [name, actor]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie actor not found." });
    }

    res.status(200).json({ message: "Movie actor deleted successfully." });
  } catch (error) {
    console.error("Delete actor error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

movieRouter.put("/update/movie", async (req, res) => {
  const { name, genre, pg_rating, release_date, description } = req.body;

  if (!name || !genre || !pg_rating || !release_date || !description) {
    return res.status(400).json({ error: "Missing required movie fields" });
  }

  try {
    const result = await client.query(
      `UPDATE MOVIE
         SET Genre = $1,
             PG_rating = $2,
             Release_date = $3,
             Description = $4
         WHERE Name = $5
         RETURNING *`,
      [genre, pg_rating, release_date, description, name]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json({ movie: result.rows[0] });
  } catch (error) {
    console.error("Update movie error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

movieRouter.put("/update/actor", async (req, res) => {
  const { movie_name, old_actor, new_actor } = req.body;

  if (!movie_name || !old_actor || !new_actor) {
    return res.status(400).json({ error: "Missing actor update fields" });
  }

  try {
    const result = await client.query(
      `UPDATE MOVIE_ACTOR
         SET Actor = $1
         WHERE Name = $2 AND Actor = $3
         RETURNING *`,
      [new_actor, movie_name, old_actor]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Movie actor not found" });
    }

    res.status(200).json({ updated: result.rows[0] });
  } catch (error) {
    console.error("Update actor error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default movieRouter;
