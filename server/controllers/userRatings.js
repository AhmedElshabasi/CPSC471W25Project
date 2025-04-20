import express from "express";
import client from "../index.js";

const userRatingRouter = express.Router();

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
