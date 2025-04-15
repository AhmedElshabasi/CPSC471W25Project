import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "./input";
import { Button } from "./button";
import { Film } from "lucide-react";

function Header() {
  const [search, setSearch] = useState("");

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
        ></Input>
      </div>
      <div className="flex w-full h-full justify-end items-center gap-4 mr-10">
        <Link to="/signup">
          <Button className="h-[60%]">Sign Up</Button>
        </Link>
        <Link to="/users">
          <Button className="h-[60%]">Login</Button>
        </Link>
        <Link to="/admin">
          <Button className="h-[60%]">Admin</Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;
