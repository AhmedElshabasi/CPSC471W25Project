import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./input";
import { Button } from "./button";
import { Film } from "lucide-react";

function Header() {
  const [search, setSearch] = useState("");
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await retrieveMovie();
        setMovieData(data.rows);
      } catch (error) {
        console.error("Error fetching Movies:", error.message);
      }
    };
    fetchMovies();
  }, []);

  const retrieveMovie = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/movies/movies");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching Movies:", error.message);
    }
  };

  const searchMovie = async (e) => {
    if (e.key === "Enter" && search.trim()) {
      const regex = new RegExp(search.trim(), "i");

      const filteredMovies = movieData.filter((movie) =>
        regex.test(movie.name)
      );

      if (filteredMovies.length === 0) {
        window.location.href = "/no-results";
      } else {
        console.log("Movie Found!", filteredMovies);
      }
    }
  };

  return (
    <div className="flex w-full bg-black h-[65px]">
      <h1 className="flex w-full h-full justify-start items-center font-bold ml-10 text-xl">
        <Link to="/" className="flex items-center gap-2">
          <Film></Film>SceneBook
        </Link>
      </h1>
      <div className="flex w-full h-full justify-center items-center">
        <Input
          type=""
          placeholder="Search for Movies"
          className="h-[60%] my-[10px]"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={searchMovie}
        ></Input>
      </div>
      <div className="flex w-full h-full justify-end items-center gap-4 mr-10">
        <Link to="/signup">
          <Button className="h-[60%]">Sign Up</Button>
        </Link>
        <Link to="/users">
          <Button className="h-[60%]">Login</Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
