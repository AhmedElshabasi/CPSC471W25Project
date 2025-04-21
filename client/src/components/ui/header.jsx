import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { Input } from "./input";
import { Button } from "./button";
import { Film } from "lucide-react";
import { useAuth } from "../../AuthContext"; 
import { cn } from "@/lib/utils"

function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const [search, setSearch] = useState("");
  const [movieData, setMovieData] = useState([]);

  const navigate = useNavigate();

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
        navigate(`/movie-search/${search.trim()}`);
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
        type="text"
        placeholder="Search for Movies"
        className={cn(
          "h-[60%] my-[10px]",
          search === "" ? "text-center" : "text-left"
        )}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={searchMovie}
      />
      </div>
      <div className="flex w-full h-full justify-end items-center gap-4 mr-10">
        {!isLoggedIn ? (
          <>
            <Link to="/signup">
              <Button className="h-[60%]">Sign Up</Button>
            </Link>
            <Link to="/login">
              <Button className="h-[60%]">Login</Button>
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/users">
              <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-lg">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
            </Link>
            <Link to="/">
              <Button variant="outline" onClick={logout} className="h-[60%]">Logout</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
