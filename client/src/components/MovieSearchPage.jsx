import React from "react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const MovieSearchPage = ({ movieDate }) => {
  const [movieImages, setMovieImages] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);

  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await retrieveMovie();
        const allMovies = data.rows;

        const regex = new RegExp(params.id, "i");
        const results = allMovies.filter(
          (movie) => regex.test(movie.name) || regex.test(movie.genre)
        );

        setFilteredMovies(results);
      } catch (error) {
        console.error("Error fetching Movies:", error.message);
      }
    };

    fetchMovies();
  }, [params.id]);

  const retrieveMovie = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/movies/movies");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Movies:", error.message);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const movieImages = {};

        await Promise.all(
          filteredMovies.map(async (movie) => {
            const movieURL = await retrieveMovieImage(movie.movie_id);
            movieImages[movie.movie_id] = movieURL;
          })
        );

        setMovieImages(movieImages);
      } catch (error) {
        console.error("Error fetching Movies:", error.message);
      }
    };
    fetchImages();
  }, [filteredMovies]);

  const retrieveMovieImage = async (movie_id) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/movies/movies/image?movie_id=${movie_id}`
      );
      const imageLink = await response.json();
      return imageLink;
    } catch (error) {
      console.error("Error fetching Movie Images:", error.message);
    }
  };

  return (
    <>
      <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">
        Search Results for: {params.id}
      </h1>
      <Separator className=""></Separator>
      <div className="flex ml-[55pt] flex-wrap gap-5 px-[5pt] mt-[10pt]">
        {filteredMovies.map((movie, index) => (
          <Card
            key={index}
            className="w-[190pt] h-[270pt] cursor-pointer relative inline-block shrink-0 overflow-hidden scroll-smooth"
            onClick={() => navigate(`/movie/${movie.name}`)}
          >
            <img
              src={movieImages[movie.movie_id]}
              alt=""
              loading="lazy"
              className="absolute inset-0 object-cover object-center rounded-lg"
            />
            <div className="absolute inset-0 bg-black/25 rounded-lg" />
            <CardHeader className="relative z-10 text-white">
              <CardTitle>{movie.name}</CardTitle>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default MovieSearchPage;
