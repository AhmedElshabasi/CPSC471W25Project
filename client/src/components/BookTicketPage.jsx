import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useLocation, useParams } from "react-router-dom"
import { FaWheelchair } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { Minus, Plus } from "lucide-react"
import { useState } from "react"
import { FaUser } from "react-icons/fa";
import { BsBadgeHdFill } from "react-icons/bs";
import TheatrePreview from "./TheatrePreview";

const BookTicketPage = () => {

  const initialRows = [
    {row: 'A', seatsLeft:['NB', 'NB'], seatsMiddle:['NB','NBW','NBWC','NB','NB',"NB", 'NBW','NBWC', "NB"], seatsRight:["NB","NB"]},
    {row: 'B', seatsLeft:['NB','NB'], seatsMiddle:['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:["NB","NB"]},
    {row: 'C', seatsLeft:['NB','NB'], seatsMiddle: ['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:["NB","NB"]},
    {row: 'D', seatsLeft:['NB','NB'], seatsMiddle: ['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:["NB","NB"]},
    {row: 'E', seatsLeft:['NB','NB'], seatsMiddle: ['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:["NB","NB"]},
    {row: 'F', seatsLeft:['NB','NB'], seatsMiddle:['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:["NB","NB"]},
    {row: 'G', seatsLeft:['NB','NB','NB','NB','NB'], seatsMiddle:['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:['NB','NB','NB','NB','NB']},
    {row: 'H', seatsLeft:['NB','NB','NB','NB','NB'], seatsMiddle:['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:['NB','NB','NB','NB','NB']},
    {row: 'I', seatsLeft:['NB','NB','NB','NB','NB'], seatsMiddle:['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:['NB','NB','NB','NB','NB']},
    {row: 'J', seatsLeft:['NB','NB','NB'], seatsMiddle:['NB','NB','NB','NB','NB',"NB", "NB", "NB", "NB"], seatsRight:['NB','NB','NB']},
  ]

  const movieName = useParams().id
  const reactLocation = useLocation()
  const queryParams = new URLSearchParams(reactLocation.search)

  const company = queryParams.get("company")
  const date = queryParams.get("date")
  const location = queryParams.get("location")
  const [regularQuantity,setRegularQuantity] = useState([])
  const [premiumQuantity, setPremiumQuantity] = useState([])
  const [totalTickets, setTotalTickets] = useState([])
  const [previewTriggered, setPreviewTrigger] = useState(false)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [rows, setRows] = useState(initialRows)

  const selectSeat = () => {
    setPreviewTrigger(true)
  }

  const handleAdd = (type) => {
    if(type === 'regular'){
      const newTicket = {number: regularQuantity.length+1, ticketType: 'Regular', seatChosen: false, seatChoice:""}
      setRegularQuantity([...regularQuantity, newTicket])
      setTotalTickets([...totalTickets, newTicket])
    }
    else{
      const newTicket = {number: premiumQuantity.length+1, ticketType: 'Premium', seatChosen: false, seatChoice:""}
      setPremiumQuantity([...premiumQuantity, newTicket])
      setTotalTickets([...totalTickets, newTicket])
    }   
  }
  
  const handleDelete = (type) => {
    if(type === 'regular'){
      console.log(regularQuantity)
      setRegularQuantity(prev => {
        const updated = prev.slice(0,-1)
        setTotalTickets(updated)
        return updated
      })
    }
    else{
      setPremiumQuantity(prev => {
        const updated = prev.slice(0,-1)
        setTotalTickets(updated)
        return updated
      })
    } 
  }

  const handleSeatSelection = (seat) => {
    const seatObject = seat.seat 
    setSelectedSeats([...selectedSeats, seatObject])
    setTotalTickets(prev => {
      const updated = prev.map(ticket => ({ ...ticket }))
      for (let i = 0; i < updated.length; i++) {
        if (!updated[i].seatChosen) {
          updated[i].seatChosen = true
          updated[i].seatChoice = seatObject
          break
        }
      }
      return updated
    })
  }

  const handleSeatDeselection = (seat) => {
    const seatObject = seat.seat
    setSelectedSeats(prev => prev.filter(s => s !== seatObject))
    setTotalTickets(prev => {
      return prev.map(ticket =>
        ticket.seatChoice === seatObject ? { ...ticket, seatChosen: false, seatChoice: null} : ticket
      )
    })
  }

  console.log(rows)

  return (
    <div className="w-full h-mvh flex justify-center items-center py-[20pt]">
        <Card className="w-[77%] h-full">
          <CardHeader>
            <CardTitle>Select Your Experience</CardTitle>
            <CardDescription>Enter below your ticket perferences</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-7">
            <div className="flex flex-row gap-[100px]">
              <div className="flex flex-col gap-2">
                <h1 className="text-md font-bold">Movie</h1>
                <h1 className="text-md">{movieName}</h1>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-md font-bold">Date</h1>
                <h1 className="text-md">{date}</h1>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-md font-bold">Time</h1>
                <Select>
                  <SelectTrigger className="w-[180px] h-[25px]">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-md font-bold">Location</h1>
                <h1 className="text-md">{location}</h1>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <CardTitle className="text-xl">Tickets</CardTitle> 
              <Card className="w-full h-fit rounded-2xl">
                <CardHeader className="flex flex-row items-center">
                  <div className="flex flex-col items-start w-full">
                    <CardTitle className="text-md">Regular Ticket: $18</CardTitle>
                    <CardDescription>Offers an affordable theatre experience at Standard High Defintion</CardDescription>
                    <div className="flex flex-row gap-3 items-center mt-1">
                      <BsBadgeHdFill className="w-[25px] h-[25px]"></BsBadgeHdFill>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end items-center w-full gap-3">
                    <Button className="p-3 rounded-3xl" variant="destructive" onClick={() => handleDelete('regular')}><Minus></Minus></Button>
                    <p className="text-center font-bold text-xl w-3">{regularQuantity.length}</p>
                    <Button className="w-fit p-3 rounded-3xl" onClick={() => handleAdd('regular')}><Plus ></Plus></Button>
                  </div>
                </CardHeader>
              </Card>
              <Card className="w-full h-fit rounded-2xl">
                <CardHeader className="flex flex-row items-center">
                  <div className="flex flex-col items-start w-full">
                    <CardTitle className="text-md">Premium Ticket: $25</CardTitle>
                    <CardDescription>Exceptional experience with 4K-HDR Dolby Atmos and recliner seats</CardDescription>
                    <div className="flex flex-row gap-3 items-center mt-1">
                      <Select>
                        <SelectTrigger className="w-[180px] h-[25px]">
                          <SelectValue placeholder="Select Screen Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4K-HDR">4K-HDR</SelectItem>
                          <SelectItem value="IMAX">IMAX</SelectItem>
                          <SelectItem value="3D">3D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-row justify-end items-center w-full gap-3">
                    <Button className="p-3 rounded-3xl"  onClick={() => handleDelete('premium')} variant="destructive"><Minus></Minus></Button>
                    <p className="text-center font-bold text-xl w-3">{premiumQuantity.length}</p>
                    <Button className="w-fit p-3 rounded-3xl" onClick={() => handleAdd('premium')}><Plus ></Plus></Button>
                  </div>
                </CardHeader>
              </Card>
              <CardTitle className="text-xl">Overview</CardTitle>
                <div className="flex flex-row gap-5 flex-wrap rounded-xl justify-center items-center">
                  {totalTickets.map((ticket, index) => {
                    return(
                    <Card className="w-[260px] h-[150px]" key={index}>
                      <CardHeader>
                        <CardTitle className="text-md mb-[-8px]">{`Ticket Number: ${index+1}`}</CardTitle>
                        <CardDescription className="font-semibol mb-[30px]">{`${ticket.ticketType}`}</CardDescription>
                        <CardDescription className="font-semibol mb-[30px]">{`Time`}</CardDescription>
                        <div className="mt-[10px]">
                        {!ticket.seatChosen ? ( <Button className="h-[20px] mt-[10px] w-fit" onClick={() => selectSeat()}>Select Seat</Button>) : (<p>{`Seat: ${ticket.seatChoice}`}</p>)}
                        </div>
                      </CardHeader>
                    </Card>
                    )
                  })}
                </div>
                 {previewTriggered ? ( <TheatrePreview rows={rows} onSeatSelect={handleSeatSelection} onSeatDeselect={handleSeatDeselection} selectedSeats={selectedSeats} totalTickets={regularQuantity.length}></TheatrePreview>) : null}
            </div>          
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
    </div>

  )
}

export default BookTicketPage