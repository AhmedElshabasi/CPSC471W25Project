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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const TicketPage = ({movieName}) => {
  
  const params = useParams()
  // Use state to cache and trigger re-renders
  const [movieData, setMovieData] = useState([])

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
 
return(
  <div className="w-full h-mvh flex justify-center items-center py-[20pt]">
    <Card className="w-[70%] h-full">
      <CardHeader className="flex gap-1">
        <CardTitle>
          <p>Book Tickets: {params.id}</p>
        </CardTitle>
        <CardDescription>{movieData.description}</CardDescription>
        <div className="flex flex-row gap-3">
          <Badge className={"w-fit"}>{movieData.genre}</Badge>
          <Badge className={"w-fit"}>{movieData.pg_rating}</Badge>
          <Badge variant="secondary" className={"w-fit"}>{`Release Date: ${String(movieData.release_date).slice(0,10)}`}</Badge>
          <Badge variant="secondary" className={"w-fit"}>{`Duration: ${movieData.duration}`}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>Enter your location</p>
       <div className="flex w-full h-full justify-center items-center gap-5">
          <Input type="" placeholder="Enter your location" className="h-[60%] my-[10px] w-[40%]"></Input>
          <Button className="h-[60%] my-[10px]">Find Theatre</Button>
      </div>
      </CardContent>
      <CardFooter>
        <p>Select Your Theatre</p>
      </CardFooter>
  </Card>
</div>
)}

export default TicketPage