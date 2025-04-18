import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

const AdminHomePage = () => {

  const params = useParams()
  const [adminDetails, setAdminDetails] = useState([])
  const [theatres, setTheatres] = useState([])
  const [movies, setMovies] = useState([])


  const retrieveDetails = async (adminId) => {

    try {
      const response = await fetch(
        `http://localhost:3001/api/admin/details?adminId=${adminId}`, 
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving Details Failed")
        return;
      }

      return data
  
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
          headers: { "Content-Type": "application/json" }
        });

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving Theatres Failed")
        return;
      }

      return data
  
    } catch (error) {
      console.error("Details error:", error);
    }
  };

  const retrieveMovies = async () => {

    try {
      const response = await fetch(
        `http://localhost:3001/api/movies/movies`, 
        {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

      const data = await response.json();

      if (!response.ok) {
        console.log("Retrieving Movies Failed")
        return;
      }

      return data
  
    } catch (error) {
      console.error("Details error:", error);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
    try{
      const data = await retrieveDetails(params.id)
      setAdminDetails(data.rows[0])
    }
    catch(error){
      console.error("Error fetching Details:", error.message);
    }
  }
    fetchDetails()
    
  }, [])

  useEffect(() => {
    const fetchTheatres = async () => {
      try{
        const data = await retrieveTheatres()
        setTheatres(data.rows) 
      }  
      catch(error){
        console.error("Error fetching Theatres:", error.message);
      }
    }
      fetchTheatres()
    }, [adminDetails])

    useEffect(() => {
      const fetchMovies = async () => {
        try{
          const data = await retrieveMovies()
          setMovies(data.rows) 
        }  
        catch(error){
          console.error("Error fetching Movies:", error.message);
        }
      }
        fetchMovies()
      }, [adminDetails])

  
  return(
    <div className="w-full h-mvh flex justify-center items-center py-[20pt]">
    <Card className="w-[85%] h-full">
      <CardHeader className="flex gap-1">
        <CardTitle>
          <p className="text-3xl">{`Welcome, ${adminDetails.username}`}</p>
        </CardTitle>
        <CardDescription>Below you will find all the current data within the system, and modification tools.</CardDescription>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {/* <p className="text-lg font-semibold">Dashboard Insights</p> */}
        <p className="text-lg font-semibold">Current Theatres</p>
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
        )}
      </CardContent>
      <CardFooter>
      </CardFooter>
  </Card>
  </div>
  )
}

export default AdminHomePage



