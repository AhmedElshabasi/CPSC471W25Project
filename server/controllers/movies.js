import express from "express";
import dotenv from "dotenv";
dotenv.config()
import client from "../index.js"

const API_KEY = process.env.TMDB_API_KEY
const movieRouter = express.Router();

// Set up a router for GET requests on /api/movies/movies to get movies from database
movieRouter.get("/movies", async (req, res) => {
  try {
    // Select all movie details
    const response = await client.query(`SELECT * FROM MOVIE`)
    return await res.json(response)
    
  } catch (error) {
    res.status(500).json({ error: "No movies in the database." });
  }
});

// Set up a router for GET requests on api/movies/image to get the images for each movieId
movieRouter.get("/movies/image", async (req, res) => {
  try{
    // Retrieve the request query
    const {movie_id} = req.query;

    // Fetch from the image from the API
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}/images?api_key=${API_KEY}`)
    const imageURL = "https://image.tmdb.org/t/p/w342/"
    const data = await response.json()

    // Send the image url as a JSON
    res.json(imageURL+data.posters[0].file_path)
  }
  catch(error){
    console.error("Unable to fetch Movie image", error)
    res.status(500).json({error: "Unable to fetch Movie image"})
  }
})

export default movieRouter;