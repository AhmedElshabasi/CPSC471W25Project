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

const images = [image1, image2, image3, image4, image5];

const Home = () => {

  const navigate = useNavigate()

  // Use state to cache and trigger re-renders
  const [movieData, setMovieData] = useState([])

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
  
  return (
    <>
    <div className="flex justify-center flex-col items-center">
      <Carousel className="w-[90%]">
        <CarouselContent>
          {images.map((image, index) => (
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
        {movieData.map((movie, index) => (
          <Card key={index} className="w-[190pt] h-[250pt] cursor-pointer inline-block shrink-0" onClick={() => navigate(`/movie/${movie.name}`)}>
            <CardHeader>
              <CardTitle>{movie.name}</CardTitle>
          </CardHeader>
            <CardContent>
          </CardContent>
          </Card>
        ))}
      </div>
    </div>  
    <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">Popular</h1>
    <Separator className></Separator>
    <div className="overflow-x-auto max-w-[88%] mx-auto mt-[15pt]">
      <div className="inline-flex gap-4">
        {movieData.map((movie, index) => (
          <Card key={index} className="w-[190pt] h-[250pt] cursor-pointer inline-block shrink-0" onClick={() => navigate(`/movie/${movie.name}`)}>
            <CardHeader>
              <CardTitle>{movie.name}</CardTitle>
          </CardHeader>
            <CardContent>
          </CardContent>
          </Card>
        ))}
      </div>
    </div>
    <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">Top Rated</h1>
    <Separator className></Separator>
    <div className="overflow-x-auto max-w-[88%] mx-auto mt-[15pt]">
      <div className="inline-flex gap-4">
        {movieData.map((movie, index) => (
          <Card key={index} className="w-[190pt] h-[250pt] cursor-pointer inline-block shrink-0" onClick={() => navigate(`/movie/${movie.name}`)}>
            <CardHeader>
              <CardTitle>{movie.name}</CardTitle>
          </CardHeader>
            <CardContent>
          </CardContent>
          </Card>
        ))}
      </div>
    </div> 
    <h1 className="text-3xl ml-[60pt] mt-[20pt] mb-[10pt] mr-[60pt]">Upcoming Movies</h1>
    <Separator className></Separator>
    <div className="overflow-x-auto max-w-[88%] mx-auto mt-[15pt]">
      <div className="inline-flex gap-4">
        {movieData.map((movie, index) => (
          <Card key={index} className="w-[190pt] h-[250pt] cursor-pointer inline-block shrink-0" onClick={() => navigate(`/movie/${movie.name}`)}>
            <CardHeader>
              <CardTitle>{movie.name}</CardTitle>
          </CardHeader>
            <CardContent>
          </CardContent>
          </Card>
        ))}
      </div>
    </div>       
    </>
  );
};

export default Home;