import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { Textarea } from "./ui/textarea";

import { format } from "date-fns";
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { badgeVariants } from "@/components/ui/badge";
import { Input } from "./ui/input";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../AuthContext";

const TicketPage = ({ movieName }) => {
  const [date, setDate] = useState(new Date());
  const params = useParams();

  // Use state to cache and trigger re-renders
  const [movieData, setMovieData] = useState({});
  const [theatreData, setTheatreData] = useState([]);
  const [movieImage, setMovieImage] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [dataRefresh, setDataRefresh] = useState(false);
  const { user } = useAuth();

  // useEffect on fetching movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch and store movies into array state variable
        const data = await retrieveMovie();
        setMovieData(data);
      } catch (error) {
        console.error("Error fetching Movies:", error.message);
      }
    };
    // Run Fetch movies to execute logic
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchAllTheatres = async () => {
      try {
        // Fetch and store movies into array state variable
        const data = await retrieveAllTheatres();
        setTheatreData(data);
      } catch (error) {
        console.error("Error fetching theatres:", error.message);
      }
    };
    // Run Fetch movies to execute logic
    fetchAllTheatres();
  }, [movieData]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        if (!movieData?.movie_id) return;
        const movieURL = await retrieveMovieImage(movieData.movie_id);
        setMovieImage(movieURL);
      } catch (error) {
        console.error("Error fetching Movies:", error.message);
      }
    };
    fetchImages();
  }, [movieData]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/userRating/movie?movie_name=${encodeURIComponent(
            movieData.name
          )}`
        );
        const data = await res.json();
        setReviews(data.reviews);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };

    fetchReviews();
  }, [[dataRefresh]]);

  const retrieveMovie = async () => {
    try {
      // Fetch movies from the database
      const response = await fetch("http://localhost:3001/api/movies/movies");
      const data = await response.json();
      for (let i = 0; i < data.rows.length; i++) {
        if (data.rows[i].name === params.id) {
          return data.rows[i];
        }
      }
      return "Data not found!";
    } catch (error) {
      console.error("Error fetching Movies:", error.message);
    }
  };

  const retrieveAllTheatres = async () => {
    try {
      // Fetch theatres from the database
      const response = await fetch("http://localhost:3001/api/theatre/details");
      const data = await response.json();
      return data.rows;
    } catch (error) {
      console.error("Error fetching theatres:", error.message);
    }
  };

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

  const findTheatres = async () => {
    try {
      console.log(`Query: Location: ${location}, Company: ${company}`);
      console.log(filteredList);
      if (company.length === 0 || location.length === 0) {
        return setSearchTriggered(false);
      }
      const response = await fetch(
        `http://localhost:3001/api/theatre/find?location=${location}&company=${company}`
      );
      const theatres = await response.json();
      setFilteredList(theatres.rows);

      return setSearchTriggered(true);
    } catch (error) {
      console.error("Error fetching Movie Images:", error.message);
    }
  };

  const bookTickets = (theatre) => {
    const movieName = movieData.name;
    const token = localStorage.getItem("token");
    const selectedDate = String(date).slice(4, 15);

    if (token) {
      navigate(
        `/movie/${movieName}/booktickets?company=${encodeURIComponent(
          theatre.company_name.trim()
        )}&location=${encodeURIComponent(
          theatre.location.trim()
        )}&date=${selectedDate}`
      );
    } else {
      navigate(`/login`);
    }
  };

  const handlePostComment = async () => {
    const token = localStorage.getItem("token");
    const selectedDate = String(date).slice(4, 15);

    if (!token) {
      navigate(`/login`);
      return;
    }

    if (!comment.trim()) {
      alert("Please enter your experience before submitting.");
      return;
    }

    try {
      const result = await fetch(
        "http://localhost:3001/api/userRating/add/rating",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movie_name: movieData.name,
            username: user.username,
            rating: comment,
            date: selectedDate,
          }),
        }
      );

      if (result.ok) {
        setDataRefresh((prev) => !prev);
        setComment("");
        alert("Successfully added review!");
      }
    } catch (error) {
      console.error("Could not add review", error);
      alert("An error occurred while adding your review.");
    }
  };

  return (
    <div className="w-full h-mvh flex justify-center items-center py-[20pt]">
      <Card className="w-[77%] h-full">
        <CardHeader className="flex gap-1">
          <CardTitle>
            <p>Book Tickets: {params.id}</p>
          </CardTitle>
          <div className="flex w-full h-full flex-row gap-3">
            <Card
              key={movieData.movie_id}
              className="w-[200px] h-[300px] flex overflow-hidden rounded-lg"
            >
              <img
                src={movieImage || null}
                alt=""
                loading="lazy"
                className="w-[200px] h-[300px] object-contain rounded-lg"
              />
              <CardContent></CardContent>
            </Card>
            <div className="flex flex-col gap-3">
              <CardDescription className="w-[900px]">
                {movieData.description}
              </CardDescription>
              <div className="flex flex-row gap-3">
                <Badge className={"w-fit"}>{movieData.genre}</Badge>
                <Badge className={"w-fit"}>{movieData.pg_rating}</Badge>
                <Badge
                  variant="secondary"
                  className={"w-fit"}
                >{`Release Date: ${String(movieData.release_date).slice(
                  0,
                  10
                )}`}</Badge>
                <Badge
                  variant="secondary"
                  className={"w-fit"}
                >{`Duration: ${movieData.duration}`}</Badge>
              </div>
              <CardTitle className="text-lg">User Experience</CardTitle>
              <div className="flex gap-3">
                <Card className="w-2/3 h-[180px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-base">User Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-y-auto space-y-4 pr-2">
                    {reviews.length === 0 ? (
                      <p className="text-muted-foreground text-sm">
                        No reviews yet.
                      </p>
                    ) : (
                      reviews.map((review, idx) => (
                        <div key={idx}>
                          <div className="mb-1">
                            <p className="text-sm font-semibold text-primary">
                              {review.username} — {review.date.split("T")[0]}
                            </p>
                            <p className="text-base italic text-muted-foreground">
                              “{review.rating}”
                            </p>
                          </div>
                          {idx !== reviews.length - 1 && <Separator />}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
                <Card className="w-1/3 h-[180px]">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">
                      Add your experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col h-full pt-0 px-3">
                    <Textarea
                      placeholder="Share your thoughts about the movie..."
                      className="resize-none h-[80px] text-sm mb-2"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-0">
                      <Button
                        className="w-[60px] h-[30px] text-xs px-2 py-1"
                        onClick={handlePostComment}
                      >
                        Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex w-full h-full my-[25px] justify-center items-center gap-5">
            <Select onValueChange={(value) => setCompany(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theatre Company" />
              </SelectTrigger>
              <SelectContent>
                {theatreData.map((theatre, index) => (
                  <SelectItem value={theatre.company_name} key={index}>
                    {theatre.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              placeholder="Location"
              className="w-[400px]"
              onChange={(e) => setLocation(e.target.value)}
            ></Input>
            <Button onClick={() => findTheatres()}>Find Theatres</Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex flex-col gap-3 h-full w-full">
            <p>Select Your Theatre</p>
            {searchTriggered ? (
              filteredList.length === 0 ? (
                <Card className="h-full w-full">
                  <CardHeader className="flex justify-center items-center">
                    <p>No Theatres Found for Input</p>
                  </CardHeader>
                </Card>
              ) : (
                filteredList.map((theatre, index) => (
                  <div key={index} className="flex flex-wrap gap-3">
                    <Card key={index} className="w-[200pt]">
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {theatre.company_name}
                        </CardTitle>
                        <CardDescription>{theatre.location}</CardDescription>
                        <CardDescription>
                          {theatre.phone_number}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex justify-center items-center">
                        <Button
                          className="text-xs"
                          onClick={() => bookTickets(theatre)}
                        >
                          {`Book Tickets for ${String(date).slice(0, 10)}`}
                          <ArrowRight></ArrowRight>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                ))
              )
            ) : (
              <Card className="h-full w-full">
                <CardHeader className="flex justify-center items-center">
                  <p>No Theatre Found</p>
                </CardHeader>
              </Card>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TicketPage;
