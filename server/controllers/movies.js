import express from "express";
import dotenv from "dotenv";
import client from "../index.js"

dotenv.config()

const API_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${API_KEY}`;

const movieRouter = express.Router();

async function movieDetails(movieID){

  try{
  const url = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US&api_key=${API_KEY}`;
  const details = await fetch(url)

  return await details.json()
  }
  catch(error){
    throw new Error(`Unable to fetch movie details for MovieID:${movieId}`);
  }

} 


movieRouter.get("/movies", async (req, res) => {
  try {
    const response = await fetch(TMDB_URL, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });
    const data = await response.json();
    res.json(data)
    const movieData = data.results
    for(const movie of movieData){
      const details = await movieDetails(movie.id)
      const name = details.title
      const genre = details.genres[0].name
      const pg_rating = details.adult ? "Rated R": "PG-13"
      const releaseDate = details.release_date
      const description = details.overview
      const duration = "00:00:00"
      const endTime = "00:00:00"
      const startTime = "00:00:00"
      const result = await client.query(
        `INSERT INTO MOVIE (name, genre, pg_rating, release_date, description, duration, end_time, start_time) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING name, genre, pg_rating, release_date, description, duration, end_time, start_time`,
        [
          name, 
          genre,
          pg_rating,
          releaseDate,
          description,
          duration,
          endTime,
          startTime
        ]
      );
    }
  } catch (error) {
    console.error("Error fetching Movies:", error.message);
    res.status(500).json({ error: "Failed to retrieve movies" });
  }
});


export default movieRouter;