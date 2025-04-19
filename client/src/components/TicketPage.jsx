import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { format } from "date-fns"
import { ArrowRight, Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"
import { badgeVariants } from "@/components/ui/badge"
import { Input } from "./ui/input"
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

const TicketPage = ({movieName}) => {

  const [date, setDate] = useState(new Date())
  const params = useParams()

  // Use state to cache and trigger re-renders
  const [movieData, setMovieData] = useState({})
  const [theatreData, setTheatreData] = useState([])
  const [movieImage, setMovieImage] = useState("")

  // useEffect on fetching movies
  useEffect(() => {
    const fetchMovies = async () => {
    try{
      // Fetch and store movies into array state variable
      const data = await retrieveMovie()
      setMovieData(data)
    }
    catch(error){
      console.error("Error fetching Movies:", error.message);
    }
  }
  // Run Fetch movies to execute logic
  fetchMovies()
  
}, [])

useEffect(() => {
  const fetchAllTheatres = async () => {
  try{
    // Fetch and store movies into array state variable
    const data = await retrieveAllTheatres()
    setTheatreData(data)
  }
  catch(error){
    console.error("Error fetching theatres:", error.message);
  }
}
// Run Fetch movies to execute logic
fetchAllTheatres()

}, [movieData])

useEffect(() => {
  const fetchImages = async () => {
    try{
      if(!movieData?.movie_id) return 
      const movieURL = await retrieveMovieImage(movieData.movie_id)
      setMovieImage(movieURL)
    }
    catch(error){
      console.error("Error fetching Movies:", error.message);
    }
  }
    fetchImages()
  
  
}, [movieData])


const retrieveMovie = async () => {
  try{
    // Fetch movies from the database
    const response = await fetch("http://localhost:3001/api/movies/movies")
    const data = await response.json()
    for(let i = 0; i < data.rows.length; i++){
      if(data.rows[i].name === params.id){
        return data.rows[i]
      }
    }
    return "Data not found!"
  }
  catch(error){
    console.error("Error fetching Movies:", error.message);
  }

}

const retrieveAllTheatres = async () => {
  try{
    // Fetch theatres from the database
    const response = await fetch("http://localhost:3001/api/theatre/details")
    const data = await response.json()
    return data.rows
  }
  catch(error){
    console.error("Error fetching theatres:", error.message);
  }

}

const retrieveMovieImage = async (movie_id) => {
  try{
    const response = await fetch(`http://localhost:3001/api/movies/movies/image?movie_id=${movie_id}`)
    const imageLink = await response.json()
    return imageLink;
  }
  catch(error){
    console.error("Error fetching Movie Images:", error.message);
  }
} 


 
return(
  <div className="w-full h-mvh flex justify-center items-center py-[20pt]">
    <Card className="w-[77%] h-full">
      <CardHeader className="flex gap-1">
        <CardTitle>
          <p>Book Tickets: {params.id}</p>
        </CardTitle>
        <div className="flex w-full h-full flex-row gap-3">
          <Card key={movieData.movie_id} className="w-[200px] h-[300px] flex overflow-hidden rounded-lg">
              <img src={movieImage} alt="" loading="lazy" className="w-[200px] h-[300px] object-contain rounded-lg"/>
              <CardContent>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-3">
            <CardDescription className="w-[900px]">{movieData.description}</CardDescription>
            <div className="flex flex-row gap-3">
              <Badge className={"w-fit"}>{movieData.genre}</Badge>
              <Badge className={"w-fit"}>{movieData.pg_rating}</Badge>
              <Badge variant="secondary" className={"w-fit"}>{`Release Date: ${String(movieData.release_date).slice(0,10)}`}</Badge>
              <Badge variant="secondary" className={"w-fit"}>{`Duration: ${movieData.duration}`}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
       <div className="flex w-full h-full justify-center items-center gap-5">
       <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theatre Company" />
        </SelectTrigger>
        <SelectContent>
          {theatreData.map((theatre, index) => 
            <SelectItem value={theatre.company_name} key={index}>{theatre.company_name}</SelectItem>
          )}       
        </SelectContent>
      </Select>
      <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
    <Input placeholder="Location" className="w-[400px]"></Input>
    <Button>Find Theatres</Button>
      </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-3 h-full w-full">
        <p>Select Your Theatre</p>
        {theatreData.length === 0 ? (
          <Card className="h-full w-full">
            <CardHeader className="flex justify-center items-center">
              <p>No Theatres Found.</p>
            </CardHeader>
          </Card>
        ) : (
          theatreData.map((theatre, index) => (
            <div className="flex flex-wrap gap-3">
              <Card key={index} className="w-[200pt]">
                <CardHeader>
                  <CardTitle className="text-lg">{theatre.company_name}</CardTitle>
                  <CardDescription>{theatre.location}</CardDescription>
                  <CardDescription>{theatre.phone_number}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center items-center">
                  <Button className="text-xs">{`Book Tickets for ${String(date).slice(0,10)}`}<ArrowRight></ArrowRight></Button>
                </CardFooter>
              </Card>
            </div>
          ))
        )}
        </div>
      </CardFooter>
  </Card>
</div>
)}

export default TicketPage