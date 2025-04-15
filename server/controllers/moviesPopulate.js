import dotenv from "dotenv";
import client from "../index.js"

// Configure the env file
dotenv.config()

// Store the API key and the url
const API_KEY = process.env.TMDB_API_KEY;
const TMDB_URL = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${API_KEY}`;

// Used to retrieve additional details of the movie (not possible with /now_paying header)
async function movieDetails(movieID){
  try{
  
  // Fetch the movies from the API
  const url = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US&api_key=${API_KEY}`;
  const details = await fetch(url)

  return await details.json()
  }
  catch(error){
    throw new Error(`Unable to fetch movie details for MovieID:${movieId}`);
  }

} 
// Used to populate the movies in the database
export async function moviePopulate(){
  try {
    // Send a GET request to the /now_playing URL
    const response = await fetch(TMDB_URL, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    // Parse the data from the API
    const data = await response.json();
    const movieData = data.results
    
    // For each movie in the response, retrieve the needed attributes
    for(const movie of movieData){

      // Fetch the additional movie details
      const details = await movieDetails(movie.id)
      const name = details.title
      const genre = details.genres[0].name
      const pg_rating = details.adult ? "Rated R": "PG-13"
      const releaseDate = details.release_date
      const description = details.overview
      
      // Need to fix duration
      const duration = "00:00:00"
      const endTime = "00:00:00"
      const startTime = "00:00:00"

      // Insert the movies into the database
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
  }
}