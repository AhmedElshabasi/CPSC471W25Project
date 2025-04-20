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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminHomePage = () => {
  const params = useParams();

  const [adminDetails, setAdminDetails] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [movies, setMovies] = useState([]);

  const [theatreLocation, setTheatreLocation] = useState("");
  const [theatrePhone, setTheatrePhone] = useState("");
  const [theatreCompany, setTheatreCompany] = useState("");

  const [movieName, setMovieName] = useState("");
  const [movieId, setMovieId] = useState("");
  const [genre, setGenre] = useState("");
  const [pgRating, setPgRating] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

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
  }, [adminDetails]);

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
  }, [adminDetails]);

  const handleAddTheatre = async () => {
    const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;

    console.log(adminDetails);
    console.log(adminDetails.permissions === "Theatre Management");
    console.log(adminDetails.permissions);

    if (adminDetails.permissions !== "Theatre Management") {
      setTheatreSuccess("");
      return setTheatreError("You do not have permission to add theatres.");
    }

    if (!theatreLocation || !theatrePhone || !theatreCompany) {
      setTheatreSuccess("");
      return setTheatreError("You do not have permission to add theatres.");
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

      const data = await theatreRes.json();

      if (theatreRes.ok) {
        setTheatreError("");
        setTheatreSuccess(`Theatre in "${theatreLocation}" added!`);
      } else {
        setTheatreSuccess("");
        setTheatreError(data.error || "Failed to add theatre.");
      }
    } catch (error) {
      console.error("Theatre creation error:", error);
      setTheatreSuccess("");
      setTheatreError("An error occurred while adding the theatre.");
    }
  };

  const handleAddMovie = async () => {};

  const handleAddAdmin = async () => {
    const phoneRegex = /^\d{3}-?\d{3}-?\d{4}$/;
    const adminIdRegex = /^[0-9]+$/;

    if (adminDetails.role != "Manager") {
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

    if (
      adminPermissions &&
      adminPermissions != "Theatre Management" &&
      adminPermissions != "Comment Management" &&
      adminPermissions != "Movie Listing Management"
    ) {
      setAdminSuccess("");
      return setAdminError("Not valid permission type for admin.");
    }

    if (
      adminRole &&
      adminRole != "Employee" &&
      adminRole != "Manager" &&
      adminRole != "Supervisor"
    ) {
      setAdminSuccess("");
      return setAdminError("Not a valid admin role.");
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
          role: adminRole,
          permissions: adminPermissions,
        }),
      });

      if (res.ok) {
        setAdminError("");
        setAdminSuccess(`Successfuly added admin ${adminUsername}!`);
      } else {
        setAdminSuccess("");
        setAdminError("Admin Already Exists.");
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
                    <p className="text-sm font-semibold">Total Revenue</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{theatres.length}</p>
                  </CardContent>
                </Card>
                <Card className="w-1/4">
                  <CardHeader>
                    <p className="text-sm font-semibold">Number of Customers</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold">{theatres.length}</p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-3">
                <Card className="w-1/2 h-[400px]">
                  <CardHeader>
                    <p className="text-bold">Overview</p>
                  </CardHeader>
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
                <p className="text-lg font-bold">Add Movie</p>
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
                  <Input
                    placeholder="Genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                  <Input
                    placeholder="PG Rating"
                    value={pgRating}
                    onChange={(e) => setPgRating(e.target.value)}
                  />
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
                  <Input
                    type="time"
                    placeholder="Duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                  <Input
                    type="time"
                    placeholder="Start Time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <Input
                    type="time"
                    placeholder="End Time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
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
              <p className="text-lg font-bold">Delete Theatre</p>
              <p className="text-lg font-bold">Delete Movies</p>
              <p className="text-lg font-bold">Delete Admin</p>
              <p className="text-lg font-bold">Delete Movie Actor</p>
            </TabsContent>
            <TabsContent value="Modify">
              <p className="text-lg font-bold">Modify Theatre</p>
              <p className="text-lg font-bold">Modify Movies</p>
              <p className="text-lg font-bold">Modify Admin</p>
              <p className="text-lg font-bold">Modify Movie Actor</p>
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
