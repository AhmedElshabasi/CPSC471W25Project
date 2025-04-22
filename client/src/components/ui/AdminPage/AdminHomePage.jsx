import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminHomePage = () => {
  const params = useParams();

  const [adminDetails, setAdminDetails] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [movieActors, setMovieActors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [movieRequests, setMovieRequests] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [theatreLocation, setTheatreLocation] = useState("");
  const [theatrePhone, setTheatrePhone] = useState("");
  const [theatreCompany, setTheatreCompany] = useState("");

  const [movieName, setMovieName] = useState("");
  const [movieId, setMovieId] = useState("");
  const [genre, setGenre] = useState("");
  const [pgRating, setPgRating] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [description, setDescription] = useState("");

  const [adminId, setAdminId] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPhone, setAdminPhone] = useState("");
  const [adminRole, setAdminRole] = useState("");
  const [adminPermissions, setAdminPermissions] = useState("");

  const [actorMovie, setActorMovie] = useState("");
  const [actorName, setActorName] = useState("");

  const [theatreError, setTheatreError] = useState("");
  const [movieError, setMovieError] = useState("");
  const [adminError, setAdminError] = useState("");
  const [actorError, setActorError] = useState("");

  const [actorSuccess, setActorSuccess] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");
  const [theatreSuccess, setTheatreSuccess] = useState("");
  const [movieSuccess, setMovieSuccess] = useState("");

  const [deleteTheatreLocation, setDeleteTheatreLocation] = useState("");
  const [deleteMovieName, setDeleteMovieName] = useState("");
  const [deleteAdminUsername, setDeleteAdminUsername] = useState("");
  const [deleteActorMovie, setDeleteActorMovie] = useState("");
  const [deleteUserRating, setDeleteUserRating] = useState("");

  const [dataRefresh, setDataRefresh] = useState(false);

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Drama",
    "Family",
    "Fantasy",
    "Horror",
    "Mystery",
    "Science Fiction",
    "Thriller",
    "War",
    "Western",
  ];

  const ratings = ["G", "PG", "PG-13", "R", "NC-17"];

  const retrieveDetails = async (adminId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/details?adminId=${adminId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving Details Failed");
        return;
      }

      return data;
    } catch (error) {
      console.error("Details error:", error);
    }
  };

  const retrieveTheatres = async (adminId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/theatre/details`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving Theatres Failed");
        return;
      }

      return data;
    } catch (error) {
      console.error("Details error:", error);
    }
  };

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

  const retrieveAdmins = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/admin/admins`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving Admins Failed");
        return;
      }

      return data;
    } catch (error) {
      console.error("Admins error:", error);
    }
  };

  const retrieveMovieActors = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/movies/actors`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving Movie Actors Failed");
        return;
      }

      return data;
    } catch (error) {
      console.error("Movie Actors error:", error);
    }
  };

  const retrieveRatings = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/userRating/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving User Reviews Failed");
        return;
      }

      return data;
    } catch (error) {
      console.error("User rating error:", error);
    }
  };

  const fetchMovieRequests = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/movies/requests");
      const data = await res.json();
      return data.rows || [];
    } catch (err) {
      console.error("Failed to fetch movie requests:", err);
      return [];
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/users/customers");
      const data = await res.json();
      return data.rows || [];
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      return [];
    }
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const data = await retrieveAdmins();
        if (data) setAdmins(data.rows);
      } catch (error) {
        console.error("Error fetching admins:", error.message);
      }
    };

    fetchAdmins();
  }, [dataRefresh]);

  useEffect(() => {
    const fetchActors = async () => {
      try {
        const data = await retrieveMovieActors();
        if (data) setMovieActors(data.rows);
      } catch (error) {
        console.error("Error fetching movie actors:", error.message);
      }
    };

    fetchActors();
  }, [dataRefresh]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await retrieveDetails(params.id);
        setAdminDetails(data.rows[0]);
      } catch (error) {
        console.error("Error fetching Details:", error.message);
      }
    };
    fetchDetails();
  }, []);

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const data = await retrieveTheatres();
        setTheatres(data.rows);
      } catch (error) {
        console.error("Error fetching Theatres:", error.message);
      }
    };
    fetchTheatres();
  }, [dataRefresh]);

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
  }, [dataRefresh]);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await retrieveRatings();
        if (data) setReviews(data.rows);
      } catch (error) {
        console.error("Error fetching movie actors:", error.message);
      }
    };
    fetchRatings();
  }, [dataRefresh]);

  useEffect(() => {
    const loadData = async () => {
      const requests = await fetchMovieRequests();
      const users = await fetchCustomers();
      setMovieRequests(requests);
      setCustomers(users);
    };
    loadData();
  }, [dataRefresh]);

  const resetStatusMessages = () => {
    setTheatreError("");
    setTheatreSuccess("");
    setMovieError("");
    setMovieSuccess("");
    setAdminError("");
    setAdminSuccess("");
    setActorError("");
    setActorSuccess("");
  };

  const handleAddTheatre = async () => {
    resetStatusMessages();
    const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;

    if (adminDetails.permissions !== "Theatre Management") {
      setTheatreSuccess("");
      return setTheatreError("You do not have permission to add theatres.");
    }

    if (!theatreLocation || !theatrePhone || !theatreCompany) {
      setTheatreSuccess("");
      return setTheatreError("Please fill in all admin fields.");
    }

    if (!phoneRegex.test(theatrePhone)) {
      setTheatreSuccess("");
      setTheatreError("Phone must be in the format 123-456-7890.");
      return;
    }

    const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");

    const matchedTheatre = theatres.find(
      (theatre) => normalize(theatre.company_name) === normalize(theatreCompany)
    );

    const actualCompanyName = matchedTheatre
      ? matchedTheatre.company_name
      : theatreCompany;

    if (!matchedTheatre) {
      try {
        const companyRes = await fetch(
          "http://localhost:3001/api/company/add",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: actualCompanyName,
              location: theatreLocation,
              phone: theatrePhone,
            }),
          }
        );

        const data = await companyRes.json();

        if (!companyRes.ok) {
          return setTheatreError(data.error || "Failed to add company.");
        }
      } catch (error) {
        console.error("Company creation error:", error);
        return setTheatreError("An error occurred while adding the company.");
      }
    }

    try {
      const theatreRes = await fetch(
        "http://localhost:3001/api/theatre/add/theatre",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: theatreLocation,
            phone: theatrePhone,
            company: actualCompanyName,
          }),
        }
      );

      if (theatreRes.ok) {
        setDataRefresh((prev) => !prev);
        setTheatreLocation("");
        setTheatreCompany("");
        setTheatrePhone("");
        setTheatreError("");
        setTheatreSuccess(`Theatre in ${theatreLocation} added!`);
      } else {
        setTheatreSuccess("");
        setTheatreError("Theatre in this location already exists.");
      }
    } catch (error) {
      console.error("Theatre creation error:", error);
      setTheatreSuccess("");
      setTheatreError("An error occurred while adding the theatre.");
    }
  };

  const handleAddMovie = async () => {
    console.log(movies);
    resetStatusMessages();
    const movieIdRegex = /^[0-9]+$/;

    if (adminDetails.permissions !== "Movie Listing Management") {
      setMovieSuccess("");
      return setMovieError("You do not have permission to add movies.");
    }

    if (
      !movieName ||
      !movieId ||
      !genre ||
      !pgRating ||
      !releaseDate ||
      !description
    ) {
      setMovieSuccess("");
      return setMovieError("Please fill in all movie fields.");
    }

    if (!movieIdRegex.test(movieId)) {
      setMovieSuccess("");
      return setMovieError(
        "Movie ID must be a number with no symbols or spaces."
      );
    }

    const today = new Date();
    const inputDate = new Date(releaseDate);
    if (inputDate < today.setHours(0, 0, 0, 0)) {
      setMovieSuccess("");
      return setMovieError("Release date cannot be in the past.");
    }

    const duplicate = movies.find(
      (m) =>
        m.movie_id === parseInt(movieId) ||
        m.name.trim().toLowerCase() === movieName.trim().toLowerCase()
    );

    if (duplicate) {
      setMovieSuccess("");
      return setMovieError("A movie with this ID or name already exists.");
    }

    try {
      const res = await fetch("http://localhost:3001/api/movies/add/movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie_id: parseInt(movieId),
          name: movieName.trim(),
          genre: genre.trim(),
          pg_rating: pgRating.trim(),
          release_date: releaseDate,
          description: description.trim(),
        }),
      });

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        setMovieName("");
        setMovieId("");
        setGenre("");
        setPgRating("");
        setReleaseDate("");
        setDescription("");
        setMovieError("");
        setMovieSuccess(`Movie "${movieName}" added!`);
      } else {
        setMovieSuccess("");
        setMovieError("A movie with this ID and name already exists.");
      }
    } catch (error) {
      console.error("Movie creation error:", error);
      setMovieSuccess("");
      setMovieError("An error occurred while adding the movie.");
    }
  };

  const handleAddAdmin = async () => {
    resetStatusMessages();
    const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;
    const adminIdRegex = /^[0-9]+$/;

    if (adminDetails.role !== "Manager") {
      setAdminSuccess("");
      return setAdminError("Only Managers are able to add other admins.");
    }

    if (
      !adminId ||
      !adminUsername ||
      !adminPassword ||
      !adminPhone ||
      !adminRole ||
      !adminPermissions
    ) {
      setAdminSuccess("");
      return setAdminError("Please fill in all admin fields.");
    }

    const isUsernameTaken = admins.some(
      (admin) => admin.username === adminUsername
    );
    if (isUsernameTaken) {
      setAdminSuccess("");
      return setAdminError("That username is already taken.");
    }

    const roleMap = {
      manager: "Manager",
      employee: "Employee",
      supervisor: "Supervisor",
    };

    const permissionMap = {
      "theatre management": "Theatre Management",
      "comment management": "Comment Management",
      "movie listing management": "Movie Listing Management",
    };

    const normalizedRole = adminRole.trim().toLowerCase();
    const normalizedPermissions = adminPermissions.trim().toLowerCase();

    const dbRole = roleMap[normalizedRole];
    const dbPermissions = permissionMap[normalizedPermissions];

    if (!dbRole) {
      setAdminSuccess("");
      return setAdminError("Not a valid admin role.");
    }

    if (!dbPermissions) {
      setAdminSuccess("");
      return setAdminError("Not a valid permission type for admin.");
    }

    if (!phoneRegex.test(adminPhone)) {
      setAdminSuccess("");
      setAdminError("Phone must be in the format 123-456-7890.");
      return;
    }

    if (!adminIdRegex.test(adminId)) {
      setAdminSuccess("");
      setAdminError("Admin ID must be a number with no spaces or symbols.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/admin/add/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_id: parseInt(adminId),
          username: adminUsername,
          password: adminPassword,
          phone: adminPhone,
          role: dbRole,
          permissions: dbPermissions,
        }),
      });

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        setAdminError("");
        setAdminId("");
        setAdminUsername("");
        setAdminPassword("");
        setAdminPhone("");
        setAdminRole("");
        setAdminPermissions("");
        setAdminSuccess(`Successfuly added ${adminUsername}!`);
      } else {
        setAdminSuccess("");
        setAdminError("Admin already exists with that ID.");
      }
    } catch (error) {
      setAdminSuccess("");
      setAdminError(
        "An unexpected error occurred while adding the admin.",
        error
      );
    }
  };

  const handleAddMovieActor = async () => {
    resetStatusMessages();
    if (adminDetails.permissions != "Movie Listing Management") {
      setActorSuccess("");
      return setActorError("You do not have permission to add movie actors.");
    }

    if (!actorMovie || !actorName) {
      setActorSuccess("");
      return setActorError("Fill all actor fields");
    }

    const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");

    const matchedMovie = movies.find(
      (m) => normalize(m.name) === normalize(actorMovie)
    );

    if (!matchedMovie) {
      setActorSuccess("");
      return setActorError("Movie not found. Try again with a different name.");
    }

    try {
      const res = await fetch("http://localhost:3001/api/movies/add/actor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: matchedMovie.name,
          actor: actorName,
        }),
      });

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        setActorError("");
        setActorSuccess(`Actor "${actorName}" added successfully.`);
      } else {
        setActorSuccess("");
        setActorError("Failed to add actor.");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred while adding the actor.",
        error
      );
    }
  };

  const handleDeleteTheatre = async (location, companyName) => {
    if (adminDetails.permissions !== "Theatre Management") {
      return alert("You do not have permission to delete theatres.");
    }

    try {
      const res = await fetch(
        "http://localhost:3001/api/theatre/delete/theatre",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location,
            companyName,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        alert(`Theatre at "${location}" was deleted.`);
      } else {
        alert(data.error || "Failed to delete theatre.");
      }
    } catch (error) {
      console.error("Delete theatre error:", error);
      alert("Unexpected error deleting theatre.");
    }
  };

  const handleDeleteMovie = async (movieName) => {
    if (adminDetails.permissions !== "Movie Listing Management") {
      return alert("You do not have permission to delete movies.");
    }

    try {
      const res = await fetch("http://localhost:3001/api/movies/delete/movie", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: movieName }),
      });

      const data = await res.json();

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        alert(`Movie "${movieName}" deleted.`);
      } else {
        alert(data.error || "Failed to delete movie.");
      }
    } catch (error) {
      console.error("Delete movie error:", error);
      alert("Unexpected error deleting movie.");
    }
  };

  const handleDeleteAdmin = async (admin_id) => {
    if (adminDetails.role !== "Manager") {
      return alert("Only Managers can delete admins.");
    }

    if (adminDetails.admin_id === admin_id) {
      return alert("Cannot remove yourself while logged in!");
    }

    try {
      const res = await fetch("http://localhost:3001/api/admin/delete/admin", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id }),
      });

      const data = await res.json();

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        alert(`Admin "${admin_id}" was deleted.`);
      } else {
        alert(data.error || "Failed to delete admin.");
      }
    } catch (error) {
      console.error("Delete admin error:", error);
      alert("Unexpected error deleting admin.");
    }
  };

  const handleDeleteMovieActor = async (movieName, actorName) => {
    if (adminDetails.permissions !== "Movie Listing Management") {
      return alert("You do not have permission to delete movie actors.");
    }

    try {
      const res = await fetch("http://localhost:3001/api/movies/delete/actor", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: movieName,
          actor: actorName,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        alert(`Removed "${actorName}" from "${movieName}".`);
      } else {
        alert(data.error || "Failed to delete actor.");
      }
    } catch (error) {
      console.error("Delete movie actor error:", error);
      alert("Unexpected error deleting movie actor.");
    }
  };

  const handleDeleteRating = async (comment_id) => {
    if (adminDetails.permissions !== "Comment Management") {
      return alert("You do not have permission to delete user ratings.");
    }

    try {
      const res = await fetch(
        "http://localhost:3001/api/userRating/delete/rating",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment_id }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        alert("Review deleted successfully.");
      } else {
        alert(data.error || "Failed to delete review.");
      }
    } catch (error) {
      console.error("Delete user rating error:", error);
      alert("Unexpected error deleting review.");
    }
  };

  const handleDeleteRequest = async (customerId, movieName) => {
    if (adminDetails.permissions !== "Movie Listing Management") {
      return alert("You do not have permission to delete movie requests.");
    }
    try {
      const res = await fetch(
        "http://localhost:3001/api/movies/delete/request",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: customerId,
            movie_name: movieName,
          }),
        }
      );

      if (res.ok) {
        setDataRefresh((prev) => !prev);
        return alert(`Successfully deleted movie request for "${movieName}"`);
      } else {
        const err = await res.json();
        console.error("Delete failed:", err);
      }
    } catch (err) {
      console.error("Request delete error:", err);
    }
  };

  return (
    <div className="w-full h-mvh flex justify-center items-center py-[20pt]">
      <Card className="w-[85%] h-full">
        <CardHeader className="flex gap-1">
          <CardTitle>
            <p className="text-3xl">{`Welcome, ${adminDetails.username}`}</p>
          </CardTitle>
          <CardDescription>
            Below you will find all the current data within the system, and
            modification tools.
          </CardDescription>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <p className="text-2xl font-semibold">Dashboard</p>
          <Tabs defaultValue="overview" className="w-full h-full">
            <TabsList className="h-[40px] mb-5 text-sm">
              <TabsTrigger
                value="overview"
                className="text-sm font-normal rounded-md"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="Add"
                className="text-sm font-normal rounded-md"
              >
                Add
              </TabsTrigger>
              <TabsTrigger
                value="Delete"
                className="text-sm font-normal rounded-md"
              >
                Delete
              </TabsTrigger>
              <TabsTrigger
                value="Modify"
                className="text-sm font-normal rounded-md"
              >
                Modify
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="flex gap-3 w-full mb-4">
                <Card className="w-1/4">
                  <CardHeader>
                    <p className="text-sm font-semibold">
                      Total Number of Theatres
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{theatres.length}</p>
                  </CardContent>
                </Card>
                <Card className="w-1/4">
                  <CardHeader>
                    <p className="text-sm font-semibold">Number of Movies</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{movies.length}</p>
                  </CardContent>
                </Card>
                <Card className="w-1/4">
                  <CardHeader>
                    <p className="text-sm font-semibold">
                      Number of Movie Requests
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">
                      {movieRequests.length}
                    </p>
                  </CardContent>
                </Card>
                <Card className="w-1/4">
                  <CardHeader>
                    <p className="text-sm font-semibold">Number of Customers</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{customers.length}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-3">
                <Card className="w-1/2 h-[400px]">
                  <CardHeader>
                    <p className="text-bold">Overview</p>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 h-[330px] overflow-hidden">
                    {/* Movie Requests */}
                    <div className="flex-1 min-h-0 flex flex-col">
                      <p className="text-sm font-semibold mb-1">
                        Movie Requests
                      </p>
                      <div className="bg-muted rounded-md p-2 overflow-y-auto flex-1 border border-border">
                        {movieRequests.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No requests yet.
                          </p>
                        ) : (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left border-b border-border">
                                <th className="py-1 pr-4">Customer ID</th>
                                <th className="py-1 pr-4">Movie</th>
                                <th className="py-1">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {movieRequests.map((req, idx) => (
                                <tr
                                  key={idx}
                                  className="border-b border-border"
                                >
                                  <td className="py-1 pr-4">
                                    {req.customer_id}
                                  </td>
                                  <td className="py-1 pr-4 italic">
                                    {req.movie_name}
                                  </td>
                                  <td className="py-1">
                                    <button
                                      onClick={() =>
                                        handleDeleteRequest(
                                          req.customer_id,
                                          req.movie_name
                                        )
                                      }
                                      className="text-red-500 hover:underline"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>

                    {/* Admin Actions */}
                  </CardContent>
                </Card>
                <Card className="w-1/2">
                  <CardHeader>
                    <p className="text-bold">Recent Movie Bookings</p>
                  </CardHeader>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="Add" className="space-y-10">
              <div className="space-y-2">
                <p className="text-lg font-bold">Add Theatre</p>
                <div className="flex gap-3 items-end">
                  <Input
                    placeholder="Location"
                    value={theatreLocation}
                    onChange={(e) => setTheatreLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Phone Number"
                    value={theatrePhone}
                    onChange={(e) => setTheatrePhone(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Company Name"
                    value={theatreCompany}
                    onChange={(e) => setTheatreCompany(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button onClick={handleAddTheatre} className="w-[120px]">
                  Add
                </Button>
                {theatreError && (
                  <p className="text-sm text-red-500">{theatreError}</p>
                )}
                {theatreSuccess && (
                  <p className="text-sm text-green-500">{theatreSuccess}</p>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-lg font-bold">Add Upcoming Movie</p>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Movie Name"
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                  />
                  <Input
                    placeholder="Movie ID"
                    value={movieId}
                    onChange={(e) => setMovieId(e.target.value)}
                  />
                  <Select onValueChange={(val) => setGenre(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(val) => setPgRating(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select PG-Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {ratings.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    placeholder="Release Date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddMovie} className="mt-2 w-[120px]">
                  Add
                </Button>
                {movieError && (
                  <p className="text-sm text-red-500">{movieError}</p>
                )}
                {movieSuccess && (
                  <p className="text-sm text-green-500">{movieSuccess}</p>
                )}
              </div>
              <div className="space-y-3">
                <p className="text-lg font-bold">Add Admin</p>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                  />
                  <Input
                    placeholder="Username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                  />
                  <Input
                    placeholder="Role (e.g. Manager)"
                    value={adminRole}
                    onChange={(e) => setAdminRole(e.target.value)}
                  />
                  <Input
                    placeholder="Permissions (e.g. Movie Listing Management)"
                    value={adminPermissions}
                    onChange={(e) => setAdminPermissions(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddAdmin} className="mt-2 w-[120px]">
                  Add
                </Button>
                {adminError && (
                  <p className="text-sm text-red-500">{adminError}</p>
                )}
                {adminSuccess && (
                  <p className="text-sm text-green-500">{adminSuccess}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold">Add Movie Actor</p>
                <div className="flex gap-2 items-end">
                  <Input
                    placeholder="Movie Name"
                    value={actorMovie}
                    onChange={(e) => setActorMovie(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    placeholder="Actor Name"
                    value={actorName}
                    onChange={(e) => setActorName(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <Button onClick={handleAddMovieActor} className="w-[120px]">
                  Add
                </Button>
                {actorError && (
                  <p className="text-sm text-red-500">{actorError}</p>
                )}
                {actorSuccess && (
                  <p className="text-sm text-green-500">{actorSuccess}</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="Delete">
              <div className="space-y-2">
                <p className="text-lg font-bold">Delete Theatre</p>
                <Input
                  placeholder="Search by Location"
                  value={deleteTheatreLocation}
                  onChange={(e) => setDeleteTheatreLocation(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Location</TableHead>
                      <TableHead className="w-[25%]">Phone Number</TableHead>
                      <TableHead className="w-[25%]">Company</TableHead>
                      <TableHead className="w-[20%] text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {theatres
                      .filter(
                        (theatre) =>
                          deleteTheatreLocation.trim() !== "" &&
                          theatre.location
                            .toLowerCase()
                            .includes(deleteTheatreLocation.toLowerCase())
                      )
                      .map((theatre) => (
                        <TableRow key={theatre.location}>
                          <TableCell className="w-[30%]">
                            {theatre.location}
                          </TableCell>
                          <TableCell className="w-[25%]">
                            {theatre.phone_number}
                          </TableCell>
                          <TableCell className="w-[25%]">
                            {theatre.company_name}
                          </TableCell>
                          <TableCell className="w-[20%] text-center">
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeleteTheatre(
                                  theatre.location,
                                  theatre.company_name
                                )
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="space-y-2 mt-8">
                <p className="text-lg font-bold">Delete Movie</p>
                <Input
                  placeholder="Enter Movie Name"
                  value={deleteMovieName}
                  onChange={(e) => setDeleteMovieName(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">Name</TableHead>
                      <TableHead className="w-[10%]">Movie ID</TableHead>
                      <TableHead className="w-[15%]">Genre</TableHead>
                      <TableHead className="w-[15%]">PG Rating</TableHead>
                      <TableHead className="w-[20%]">Release Date</TableHead>
                      <TableHead className="w-[20%] text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies
                      .filter(
                        (movie) =>
                          deleteMovieName.trim() !== "" &&
                          movie.name
                            .toLowerCase()
                            .includes(deleteMovieName.toLowerCase())
                      )
                      .map((movie, index) => (
                        <TableRow key={index}>
                          <TableCell className="w-[20%]">
                            {movie.name}
                          </TableCell>
                          <TableCell className="w-[10%]">
                            {movie.movie_id}
                          </TableCell>
                          <TableCell className="w-[15%]">
                            {movie.genre}
                          </TableCell>
                          <TableCell className="w-[15%]">
                            {movie.pg_rating}
                          </TableCell>
                          <TableCell className="w-[20%]">
                            {new Date(movie.release_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="w-[20%] text-center">
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteMovie(movie.name)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="space-y-2 mt-8">
                <p className="text-lg font-bold">Delete Admin</p>
                <Input
                  placeholder="Search by Username"
                  value={deleteAdminUsername}
                  onChange={(e) => setDeleteAdminUsername(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[10%]">Admin ID</TableHead>
                      <TableHead className="w-[15%]">Username</TableHead>
                      <TableHead className="w-[15%]">Role</TableHead>
                      <TableHead className="w-[25%]">Permissions</TableHead>
                      <TableHead className="w-[20%]">Phone</TableHead>
                      <TableHead className="w-[15%] text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins
                      .filter(
                        (admin) =>
                          deleteAdminUsername.trim() !== "" &&
                          admin.username
                            .toLowerCase()
                            .includes(deleteAdminUsername.toLowerCase())
                      )
                      .map((admin) => (
                        <TableRow key={admin.admin_id}>
                          <TableCell>{admin.admin_id}</TableCell>
                          <TableCell>{admin.username}</TableCell>
                          <TableCell>{admin.role}</TableCell>
                          <TableCell>{admin.permissions}</TableCell>
                          <TableCell>{admin.phone_number}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteAdmin(admin.admin_id)}
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 mt-8">
                <p className="text-lg font-bold">Delete Movie Actor</p>
                <Input
                  placeholder="Search by Actor Name"
                  value={deleteActorMovie}
                  onChange={(e) => setDeleteActorMovie(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Movie</TableHead>
                      <TableHead className="w-[40%]">Actor</TableHead>
                      <TableHead className="w-[20%] text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movieActors
                      .filter(
                        (actor) =>
                          deleteActorMovie.trim() !== "" &&
                          actor.actor
                            .toLowerCase()
                            .includes(deleteActorMovie.toLowerCase())
                      )
                      .map((actor, index) => (
                        <TableRow key={`${actor.name}-${actor.actor}-${index}`}>
                          <TableCell>{actor.name}</TableCell>
                          <TableCell>{actor.actor}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeleteMovieActor(actor.name, actor.actor)
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 mt-8">
                <p className="text-lg font-bold">Delete User Rating</p>
                <Input
                  placeholder="Search by Username"
                  value={deleteUserRating}
                  onChange={(e) => setDeleteUserRating(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Movie</TableHead>
                      <TableHead className="w-[30%]">User</TableHead>
                      <TableHead className="w-[20%]">Rating</TableHead>
                      <TableHead className="w-[20%] text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews
                      .filter(
                        (review) =>
                          deleteUserRating.trim() !== "" &&
                          review.username
                            .toLowerCase()
                            .includes(deleteUserRating.toLowerCase())
                      )
                      .map((review, index) => (
                        <TableRow
                          key={`${review.username}-${review.movie_name}-${review.rating}-${index}`}
                        >
                          <TableCell>{review.movie_name}</TableCell>
                          <TableCell>{review.username}</TableCell>
                          <TableCell>{review.rating}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="destructive"
                              onClick={() =>
                                handleDeleteRating(review.comment_id)
                              }
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            <TabsContent value="Modify" className="space-y-10">
              {/* Modify Theatre */}
              <div className="space-y-2">
                <p className="text-lg font-bold">Modify Theatre</p>
                <Input
                  placeholder="Search by Location"
                  value={deleteTheatreLocation}
                  onChange={(e) => setDeleteTheatreLocation(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location</TableHead>
                      <TableHead>Current Phone</TableHead>
                      <TableHead>Current Company</TableHead>
                      <TableHead>New Phone</TableHead>
                      <TableHead>New Company</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {theatres
                      .filter(theatre => theatre.location.toLowerCase().includes(deleteTheatreLocation.toLowerCase()))
                      .map((theatre) => {
                        const loc = theatre.location;
                        return (
                          <TableRow key={loc}>
                            <TableCell>{loc}</TableCell>
                            <TableCell>{theatre.phone_number}</TableCell>
                            <TableCell>{theatre.company_name}</TableCell>
                            <TableCell>
                              <Input
                                placeholder="New Phone"
                                onChange={(e) => theatre.newPhone = e.target.value}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder="New Company"
                                onChange={(e) => theatre.newCompany = e.target.value}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                onClick={async () => {
                                  if (adminDetails.permissions !== "Theatre Management") return alert("No permission");
                                  try {
                                    const res = await fetch("http://localhost:3001/api/theatre/update/theatre", {
                                      method: "PUT",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        location: loc,
                                        new_phone: theatre.newPhone || theatre.phone_number,
                                        new_company: theatre.newCompany || theatre.company_name,
                                      }),
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                      setDataRefresh(prev => !prev);
                                      alert("Theatre updated");
                                    } else alert(data.error);
                                  } catch (err) {
                                    console.error(err);
                                    alert("Update failed");
                                  }
                                }}
                              >
                                Update
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>

              {/* Modify Movie */}
              <div className="space-y-2">
                <p className="text-lg font-bold">Modify Movie</p>
                <Input
                  placeholder="Search by Movie Name"
                  value={deleteMovieName}
                  onChange={(e) => setDeleteMovieName(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Genre</TableHead>
                      <TableHead>PG Rating</TableHead>
                      <TableHead>Release Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies
                      .filter(movie => movie.name.toLowerCase().includes(deleteMovieName.toLowerCase()))
                      .map((movie) => (
                        <TableRow key={movie.name}>
                          <TableCell>{movie.name}</TableCell>
                          <TableCell>
                            <Input onChange={(e) => movie.newGenre = e.target.value} placeholder={movie.genre} />
                          </TableCell>
                          <TableCell>
                            <Input onChange={(e) => movie.newRating = e.target.value} placeholder={movie.pg_rating} />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={movie.newDate || new Date(movie.release_date).toISOString().split("T")[0]}
                              onChange={(e) => (movie.newDate = e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input onChange={(e) => movie.newDesc = e.target.value} placeholder={movie.description} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={async () => {
                                if (adminDetails.permissions !== "Movie Listing Management") return alert("No permission");
                                try {
                                  const res = await fetch("http://localhost:3001/api/movies/update/movie", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      name: movie.name,
                                      genre: movie.newGenre || movie.genre,
                                      pg_rating: movie.newRating || movie.pg_rating,
                                      release_date: movie.newDate || movie.release_date,
                                      description: movie.newDesc || movie.description,
                                    }),
                                  });
                                  const data = await res.json();
                                  if (res.ok) {
                                    setDataRefresh(prev => !prev);
                                    alert("Movie updated");
                                  } else alert(data.error);
                                } catch (err) {
                                  console.error(err);
                                  alert("Update failed");
                                }
                              }}
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Modify Admin */}
              <div className="space-y-2">
                <p className="text-lg font-bold">Modify Admin</p>
                <Input
                  placeholder="Search by Username"
                  value={deleteAdminUsername}
                  onChange={(e) => setDeleteAdminUsername(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins
                      .filter(admin => admin.username.toLowerCase().includes(deleteAdminUsername.toLowerCase()))
                      .map((admin) => (
                        <TableRow key={admin.admin_id}>
                          <TableCell>{admin.username}</TableCell>
                          <TableCell>
                            <Input onChange={(e) => admin.newRole = e.target.value} placeholder={admin.role} />
                          </TableCell>
                          <TableCell>
                            <Input onChange={(e) => admin.newPermissions = e.target.value} placeholder={admin.permissions} />
                          </TableCell>
                          <TableCell>
                            <Input onChange={(e) => admin.newPhone = e.target.value} placeholder={admin.phone_number} />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={async () => {
                                if (adminDetails.role !== "Manager") return alert("No permission");
                                try {
                                  const res = await fetch("http://localhost:3001/api/admin/update/admin", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      admin_id: admin.admin_id,
                                      new_role: admin.newRole || admin.role,
                                      new_permissions: admin.newPermissions || admin.permissions,
                                      new_phone: admin.newPhone || admin.phone_number,
                                    }),
                                  });
                                  const data = await res.json();
                                  if (res.ok) {
                                    setDataRefresh(prev => !prev);
                                    alert("Admin updated");
                                  } else alert(data.error);
                                } catch (err) {
                                  console.error(err);
                                  alert("Update failed");
                                }
                              }}
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>

              {/* Modify Movie Actor */}
              <div className="space-y-2">
                <p className="text-lg font-bold">Modify Movie Actor</p>
                <Input
                  placeholder="Search by Actor Name"
                  value={deleteActorMovie}
                  onChange={(e) => setDeleteActorMovie(e.target.value)}
                />
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movie</TableHead>
                      <TableHead>Current Actor</TableHead>
                      <TableHead>New Actor</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movieActors
                      .filter(actor => actor.actor.toLowerCase().includes(deleteActorMovie.toLowerCase()))
                      .map((actor) => (
                        <TableRow key={`${actor.name}-${actor.actor}`}>
                          <TableCell>{actor.name}</TableCell>
                          <TableCell>{actor.actor}</TableCell>
                          <TableCell>
                            <Input onChange={(e) => actor.newActor = e.target.value} placeholder="New Actor" />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              onClick={async () => {
                                if (adminDetails.permissions !== "Movie Listing Management") return alert("No permission");
                                try {
                                  const res = await fetch("http://localhost:3001/api/movies/update/actor", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      movie_name: actor.name,
                                      old_actor: actor.actor,
                                      new_actor: actor.newActor,
                                    }),
                                  });
                                  const data = await res.json();
                                  if (res.ok) {
                                    setDataRefresh(prev => !prev);
                                    alert("Actor updated");
                                  } else alert(data.error);
                                } catch (err) {
                                  console.error(err);
                                  alert("Update failed");
                                }
                              }}
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default AdminHomePage;

{
  /* <p className="text-lg font-semibold">Current Theatres</p>
        {theatres.length === 0 ? (<Card className="w-full h-[200px] flex justify-center items-center">
          <CardContent className="flex justify-center items-center">
            <h1>No theatres found. Use the form below to add a new one</h1>
          </CardContent>
        </Card>):(
        <Table>
          <TableCaption>A List of your Current Theatres</TableCaption>
          <TableHeader >
            <TableRow className="w-full">
              <TableHead className="w-1/3 text-left">Company</TableHead>
              <TableHead className="w-1/3 text-left">Phone Number</TableHead>
              <TableHead className="w-1/3 text-left">Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {theatres.map((theatre, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{theatre.company_name}</TableCell>
                <TableCell>{theatre.phone_number}</TableCell>
                <TableCell>{theatre.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Number of Theatres</TableCell>
              <TableCell className="text-center">{theatres.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        )}
         <p className="text-lg font-semibold">Current Movies</p>
        {theatres.length === 0 ? (<Card className="w-full h-[200px] flex justify-center items-center">
          <CardContent className="flex justify-center items-center">
            <h1>No theatres found. Use the form below to add a new one</h1>
          </CardContent>
        </Card>):(
        <Table>
          <TableCaption>A List of your Current Movies</TableCaption>
          <TableHeader>
            <TableRow className="w-full">
              <TableHead className="w-1/8 text-left">Name</TableHead>
              <TableHead className="w-1/8 text-left">Movie Id</TableHead>
              <TableHead className="w-1/8 text-left">Genre</TableHead>
              <TableHead className="w-1/8 text-left">PG-Rating</TableHead>
              <TableHead className="w-1/8 text-left">Release Date</TableHead>
              <TableHead className="w-1/8 text-left">Duration</TableHead>
              <TableHead className="w-1/8 text-left">Start Time</TableHead>
              <TableHead className="w-1/8 text-left">End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{movie.name}</TableCell>
                <TableCell>{movie.movie_id}</TableCell>
                <TableCell>{movie.genre}</TableCell>
                <TableCell>{movie.pg_rating}</TableCell>
                <TableCell>{String(movie.release_date).slice(0,10)}</TableCell>
                <TableCell>{movie.duration}</TableCell>
                <TableCell>{movie.start_time}</TableCell>
                <TableCell>{movie.end_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Total Number of Movies</TableCell>
              <TableCell className="text-center">{movies.length}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        )} */
}
