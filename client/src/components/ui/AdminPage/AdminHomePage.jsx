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
            <TabsContent value="Add">
              <p className="text-lg font-bold ">Add Theatre</p>
              <p className="text-lg font-bold">Add Movies</p>
              <p className="text-lg font-bold">Add Admin</p>
              <p className="text-lg font-bold">Add Movie Actor</p>
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
