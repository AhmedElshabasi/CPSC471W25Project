import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RequestMoviePage = ({ customer_id }) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const customerId = params.get("customer-id");
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [movieRequest, setMovieRequest] = useState("");

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState("success");

  const retrieveMovies = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/movies/movies`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving Movies Failed");
        return;
      }

      return data;
    } catch (error) {
      console.error("Details error:", error);
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await retrieveMovies();
        setMovies(data.rows);
      } catch (error) {
        console.error("Error fetching Movies:", error.message);
      }
    };
    fetchMovies();
  }, []);

  const handleMovieRequest = async () => {
    if (!movieRequest.trim()) {
      setStatusMessage("Please enter a movie name.");
      setStatusType("error");
      return;
    }

    const formattedInput = movieRequest.trim().toLowerCase();
    const matchedMovie = movies.find(
      (movie) => movie.name.trim().toLowerCase() === formattedInput
    );

    if (!matchedMovie) {
      setStatusMessage("Movie not found in our database.");
      setStatusType("error");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/movies/add/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          movie_name: matchedMovie.name,
        }),
      });

      if (res.ok) {
        setStatusMessage("Movie request submitted successfully!");
        setStatusType("success");
        setMovieRequest("");
        navigate("/");
      } else {
        setStatusMessage(
          "You have already submitted a request for this movie."
        );
        setStatusType("error");
      }
    } catch (error) {
      console.error("Request error:", error);
      setStatusMessage("Unexpected error occurred.");
      setStatusType("error");
    }
  };

  return (
    <div className="flex justify-center items-start pt-24 min-h-screen bg-black px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Request a Movie
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Enter movie name"
            value={movieRequest}
            onChange={(e) => setMovieRequest(e.target.value)}
          />
          <Button onClick={handleMovieRequest}>Submit Request</Button>
          {statusMessage && (
            <p
              className={`text-sm ${
                statusType === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {statusMessage}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestMoviePage;
