import { useState } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

function Header() {
  const [search, setSearch] = useState("");

  return (
    <div className="bg-gray-900 text-white shadow">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">SceneBook</h1>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search for movies or theaters"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/signUp"
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-sm font-medium"
          >
            Sign Up
          </Link>
          <Link
            to="/users"
            className="px-4 py-2 rounded-md border border-gray-400 text-sm font-medium hover:bg-gray-800"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
