import express from "express";
import client from "../index.js";

const userRatingRouter = express.Router();

userRatingRouter.post("/add/rating", async (req, res) => {
  const { movie_name, username, rating, date } = req.body;

  if (!movie_name || !username || !rating) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const idResult = await client.query(
      `SELECT MAX(Comment_id) as max_id FROM USER_RATING`
    );
    const comment_id = (idResult.rows[0].max_id || 0) + 1;

    await client.query(
      `INSERT INTO USER_RATING (Comment_id, Date, Movie_name, Username, Rating)
         VALUES ($1, $2, $3, $4, $5)`,
      [comment_id, date, movie_name, username, rating]
    );

    res.status(201).json({ message: "Review added successfully." });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

userRatingRouter.get("/movie", async (req, res) => {
  const { movie_name } = req.query;

  if (!movie_name) {
    return res.status(400).json({ error: "Movie name is required." });
  }

  try {
    const result = await client.query(
      `SELECT Username, Rating, Date FROM USER_RATING WHERE Movie_name = $1 ORDER BY Date DESC`,
      [movie_name]
    );

    res.status(200).json({ reviews: result.rows });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Server error." });
  }
});

userRatingRouter.get("/all", async (req, res) => {
  try {
    const result = await client.query(
      `SELECT * FROM USER_RATING ORDER BY Date DESC`
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching all reviews:", error);
    res.status(500).json({ error: "Server error." });
  }
});

userRatingRouter.delete("/delete/rating", async (req, res) => {
  const { comment_id } = req.body;

  if (!comment_id) {
    return res.status(400).json({ error: "Comment ID is required." });
  }

  try {
    const result = await client.query(
      `DELETE FROM USER_RATING WHERE Comment_id = $1 RETURNING *`,
      [comment_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Review not found." });
    }

    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default userRatingRouter;
