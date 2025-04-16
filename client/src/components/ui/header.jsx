import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./input";
import { Button } from "./button";
import { Film } from "lucide-react";

function Header() {
  const [search, setSearch] = useState("");

  const searchMovie = async (e) => {
    if (e.key === "Enter" && search.trim()) {
      try {
        const response = await fetch("http://localhost:3001/api/movies/movie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ movieName: search }),
        });

        if (!response.ok) {
          console.log("Movie not found.");
          return;
        }

        const data = await response.json();
        alert(data.rows[0].name);
      } catch (error) {
        console.error("Error finding movie:", error.message);
      }
    }
  };

  // const retrieveMovie = async (e) => {
  //   if (e.key === "Enter" && search.trim()) {
  //       try {
  //           const response = await fetch("http://localhost:3001/api/movies/movies");
  //           const movies = await response.json();

  //         } catch (error) {
  //           console.error("Error finding movie:", error.message);
  //         }
  //   }
  // };

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
        <Link to="/login">
          <Button className="h-[60%]">Login</Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
