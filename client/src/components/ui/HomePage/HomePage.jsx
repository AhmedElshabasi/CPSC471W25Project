import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

import { Separator } from "../separator";

import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Static images for the preview
import image1 from "@/assets/image_1.webp";
import image2 from "@/assets/image_2.webp";
import image3 from "@/assets/image_3.webp";
import image4 from "@/assets/image_4.webp";
import image5 from "@/assets/image_5.webp";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

const topImages = [image1, image2, image3, image4, image5];

const Home = () => {

  const navigate = useNavigate()

  // Use state to cache and trigger re-renders
  const [movieData, setMovieData] = useState([])

  const [movieImages, setMovieImages] = useState([])

  // Function used to retrieve movies from the Database
  const retrieveMovie = async () => {
    try{
      // Fetch movies from the database
      const response = await fetch("http://localhost:3001/api/movies/movies")
      const data = await response.json()
      return data
    }
    catch(error){
      console.error("Error fetching Movies:", error.message);
    }
  }

  const retrieveMovieImage = async (movie_id) => {
    try{
      const response = await fetch(`http://localhost:3001/api/movies/movies/image?movie_id=${movie_id}`)
      const imageLink = await response.json()
      return imageLink;
    }
    catch(error){
      console.error("Error fetching Movie Images:", error.message);
    }
  } 
  // useEffect on fetching movies
  useEffect(() => {
    const fetchMovies = async () => {
    try{
      // Fetch and store movies into array state variable
      const data = await retrieveMovie()
      setMovieData((data.rows))
    }
    catch(error){
      console.error("Error fetching Movies:", error.message);
    }
  }
    // Run Fetch movies to execute logic
    fetchMovies()
    
  }, [])
// Used effect for fetching movie images
  useEffect(() => {
    const fetchImages = async () => {
      try{
        const movieImages = {}

        // Fetch all the movie images using the MovieId
        await Promise.all(
          movieData.map(async (movie) => {
            const movieURL = await retrieveMovieImage(movie.movie_id)
            movieImages[movie.movie_id] = movieURL
          })
        )
          // Set the state variable to the movie image url array
          setMovieImages(movieImages)
      }
      catch(error){
        console.error("Error fetching Movies:", error.message);
      }
    }
      fetchImages()
    
    
}, [movieData])
 

  return (
    <>
    <div className="flex justify-center flex-col items-center">
      <Carousel className="w-[90%]">
        <CarouselContent>
          {topImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex w-full h-full items-center justify-center p-2">
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
    <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">Now In Theatres</h1>
    <Separator className></Separator>
    <div className="overflow-x-auto max-w-[88%] mx-auto mt-[15pt]">
      <div className="inline-flex gap-4">
      {movieData.map((movie, index) => {
        if(index > 0 && index < 20){
          return(
          <Card key={index} className="w-[190pt] h-[270pt] cursor-pointer relative inline-block shrink-0 overflow-hidden scroll-smooth" onClick={() => navigate(`/movie/${movie.name}`)}>
            <img src={movieImages[movie.movie_id]} alt="" loading="lazy" className="absolute inset-0 object-cover object-center rounded-lg"/>
            <div className="absolute inset-0 bg-black/25 rounded-lg" />
            <CardHeader className="relative z-10 text-white">
              <CardTitle>{movie.name}</CardTitle>
          </CardHeader>
            <CardContent>
          </CardContent>
          </Card>
          )
        }})}
      </div>
    </div>
    <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">Popular</h1>
    <Separator className></Separator>
    <div className="overflow-x-auto max-w-[88%] mx-auto mt-[15pt]">
      <div className="inline-flex gap-4">
      {movieData.map((movie, index) => {
        if(index > 20 && index < 40){
          return(
          <Card key={index} className="w-[190pt] h-[270pt] cursor-pointer relative inline-block shrink-0 overflow-hidden scroll-smooth" onClick={() => navigate(`/movie/${movie.name}`)}>
            <img src={movieImages[movie.movie_id]} alt="" loading="lazy" className="absolute inset-0 object-cover object-center rounded-lg"/>
            <div className="absolute inset-0 bg-black/25 rounded-lg" />
            <CardHeader className="relative z-10 text-white">
              <CardTitle>{movie.name}</CardTitle>
          </CardHeader>
            <CardContent>
          </CardContent>
          </Card>
          )
        }})}
      </div>
    </div>
    <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">Top Rated</h1>
    <Separator className></Separator>
    <div className="overflow-x-auto max-w-[88%] mx-auto mt-[15pt]">
      <div className="inline-flex gap-4">
      {movieData.map((movie, index) => {
        if(index > 40 && index < 60){
          return(
          <Card key={index} className="w-[190pt] h-[270pt] cursor-pointer relative inline-block shrink-0 overflow-hidden scroll-smooth" onClick={() => navigate(`/movie/${movie.name}`)}>
            <img src={movieImages[movie.movie_id]} alt="" loading="lazy" className="absolute inset-0 object-cover object-center rounded-lg"/>
            <div className="absolute inset-0 bg-black/25 rounded-lg" />
            <CardHeader className="relative z-10 text-white">
              <CardTitle>{movie.name}</CardTitle>
          </CardHeader>
            <CardContent>
          </CardContent>
          </Card>
          )
        }})}
      </div>
    </div>
    <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">Upcoming Movies</h1>
    <Separator className></Separator>
    <div className="overflow-x-auto max-w-[88%] mx-auto mt-[15pt]">
      <div className="inline-flex gap-4">
      {movieData.map((movie, index) => {
        if(index > 60 && index < 80){
          return(
          <Card key={index} className="w-[190pt] h-[270pt] cursor-pointer relative inline-block shrink-0 overflow-hidden scroll-smooth" onClick={() => navigate(`/movie/${movie.name}`)}>
            <img src={movieImages[movie.movie_id]} alt="" loading="lazy" className="absolute inset-0 object-cover object-center rounded-lg"/>
            <div className="absolute inset-0 bg-black/25 rounded-lg" />
            <CardHeader className="relative z-10 text-white">
              <CardTitle>{movie.name}</CardTitle>
          </CardHeader>
            <CardContent>
          </CardContent>
          </Card>
          )
        }})}
      </div>
    </div>
    </>
  );
};

export default Home;