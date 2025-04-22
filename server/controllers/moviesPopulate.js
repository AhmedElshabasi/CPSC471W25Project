import dotenv from "dotenv";
import client from "../index.js";

// Configure the env file
dotenv.config();

// Store the API key and the url
const API_KEY = process.env.TMDB_API_KEY;
const NOW_PLAYING = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1&api_key=${API_KEY}`;
const POPULAR = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=${API_KEY}`;
const TOP_RATED = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&api_key=${API_KEY}`;
const UPCOMING = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&api_key=${API_KEY}`;

// Used to retrieve additional details of the movie (not possible with /now_paying header)
async function movieDetails(movieID) {
  try {
    // Fetch the movies from the API
    const url = `https://api.themoviedb.org/3/movie/${movieID}?language=en-US&api_key=${API_KEY}`;
    const details = await fetch(url);

    return await details.json();
  } catch (error) {
    throw new Error(`Unable to fetch movie details for MovieID:${movieId}`);
  }
}
// Used to populate the movies in the database
export async function moviePopulate() {
  try {
    // Send a GET request to the /now_playing URL
    const response = await Promise.all([
      fetch(NOW_PLAYING, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }),
      // Send a GET request to the /popular URL
      fetch(POPULAR, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }),
      // Send a GET request to the /top_rated URL
      fetch(TOP_RATED, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }),
      // Send a GET request to the /upcoming URL
      fetch(UPCOMING, {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }),
    ]);

    // Await until all the data has been sucessfully fetched
    const movieData = await Promise.all(
      response.map(async (res, index) => {
        // Store each response as a JSON into data
        const data = await res.json();
        return data.results;
      })
    );

    const movieArray = [];

    // Convert the 2D array data into 1D array
    for (let i = 0; i < movieData.length; i++) {
      for (let j = 0; j < movieData[i].length; j++) {
        movieArray[i * movieData[i].length + j] = movieData[i][j].id;
      }
    }

    // Only store the movies that are unique
    const movieSet = new Set(movieArray);

    // For each movie in the response, retrieve the needed attributes
    for (const movie of movieSet) {
      // Fetch the additional movie details
      const details = await movieDetails(movie);
      const name = details.title;

      const movie_id = details.id;
      const genre = details.genres[0].name;
      const pg_rating = details.adult ? "Rated R" : "PG-13";
      const releaseDate = details.release_date;
      const description = details.overview;

      // Need to fix duration
      const duration = "00:00:00";
      const endTime = "00:00:00";
      const startTime = "00:00:00";

      // Insert the movies into the database
      // Changed Schema to include movieID to fetch images from the API
      const result = await client.query(
        `INSERT INTO MOVIE (name, movie_id, genre, pg_rating, release_date, description, duration, end_time, start_time) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
        RETURNING name, movie_id, genre, pg_rating, release_date, description, duration, end_time, start_time`,
        [
          name,
          movie_id,
          genre,
          pg_rating,
          releaseDate,
          description,
          duration,
          endTime,
          startTime,
        ]
      );
    }
  } catch (error) {
    console.error("Error fetching Movies:", error.message);
  }
}
