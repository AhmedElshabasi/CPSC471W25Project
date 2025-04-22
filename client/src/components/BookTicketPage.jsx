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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


const BookTicketPage = () => {
  const { token } = useAuth();
  const rows = [
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
  const [premiumType, setPremiumType] = useState("4K-HDR")
  const [activeTab, setActiveTab] = useState("regular")
  const [selectedSeatsStandard, setSelectedSeatsStandard] = useState([])
  const [selectedSeats4K, setSelectedSeats4K] = useState([])
  const [selectedSeatsIMAX, setSelectedSeatsIMAX] = useState([])
  const [selectedSeats3D, setSelectedSeats3D] = useState([])
  const [standardRows, setStandardRows] = useState(rows)
  const [rows4K, setRows4K] = useState(rows)
  const [IMAXrows, setRowsIMAX] = useState(rows)
  const [rows3D, setRows3D] = useState(rows)
  const [selectTime, setSelectedTime] = useState("12:00 AM")
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [availablePayments, setAvailablePayments] = useState([]);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const allChosen = totalTickets.length > 0 && totalTickets.every(t => t.seatChosen);
    if (allChosen && token) {
      fetchAvailablePayments();
    }
  }, [totalTickets, token]);
  
  const fetchAvailablePayments = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/payment", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch payments");
      }
  
      const { payments = [], cards = [], paypals = [] } = data;
  
      const merged = payments.map((payment) => {
        const card = cards.find((c) => c.payment_id === payment.payment_id);
        const paypal = paypals.find((p) => p.payment_id === payment.payment_id);
  
        if (card) {
          return {
            type: "card",
            payment_id: payment.payment_id,
            details: {
              card_holder: card.card_holder,
              card_type: card.card_type,
              expiration_date: card.expiration_date,
              last4: payment.card_number?.toString().slice(-4) || "****",
            },
          };
        }
  
        if (paypal) {
          return {
            type: "paypal",
            payment_id: payment.payment_id,
            details: {
              email_address: paypal.email_address,
              phone_number: paypal.phone_number,
            },
          };
        }
  
        return null; // fallback
      }).filter(Boolean);
  
      setAvailablePayments(merged);
    } catch (err) {
      console.error("Fetch payment error:", err);
    }
  };  

  const genrateTime = () => {
    const setupTime = []
    for (let i = 0; i < 24; i += 2) {
      const hour = i % 12 === 0 ? 12 : i % 12
      const period = i < 12 ? "AM" : "PM"
      setupTime.push(`${hour}:00 ${period}`)
    }
      return setupTime
  }

  const [time, setTime] = useState(genrateTime())


  const selectSeat = (screentype) => {
    setActiveTab(screentype)
    
  }

  const handleAdd = (type) => {
    if(type === 'regular'){
      const newTicket = {number: regularQuantity.length+1, ticketType: 'Regular', seatChosen: false, seatChoice:"", screentype: "Standard", auditorium: "1", time:selectTime}
      setRegularQuantity([...regularQuantity, newTicket])
      setTotalTickets([...totalTickets, newTicket])
    }
    else{
      const auditoriumNum = premiumType === "4K-HDR" ? ("2") : premiumType === "IMAX" ? ("3") : premiumType === "3D" ? ("4") : null
      const newTicket = {number: premiumQuantity.length+1, ticketType: 'Premium', seatChosen: false, seatChoice:"", screentype: premiumType, auditorium: auditoriumNum, time: selectTime}
      setPremiumQuantity([...premiumQuantity, newTicket])
      setTotalTickets([...totalTickets, newTicket])
    }   
  }
  
  const handleDelete = (type) => {
    if(type === 'regular'){
      setRegularQuantity(prev => {
        const updated = prev.slice(0,-1)
        console.log(updated)

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

  const handleSeatSelection = (seat, type) => {
    const seatObject = seat.seat 
    if (type === "Standard") {
      setSelectedSeatsStandard(prev => [...prev, seatObject])
    } else if (type === "4K-HDR") {
      setSelectedSeats4K(prev => [...prev, seatObject])
    } else if (type === "IMAX") {
      setSelectedSeatsIMAX(prev => [...prev, seatObject])
    } else if (type === "3D") {
      setSelectedSeats3D(prev => [...prev, seatObject])
    }
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

  const handlePurchase = () => {
    localStorage.setItem("totalTickets", totalTickets)
  
  }

  const handleSeatDeselection = (seat, type) => {
    const seatObject = seat.seat
    if (type === "Standard") {
      setSelectedSeatsStandard(prev => prev.filter(s => s !== seatObject))
    } else if (type === "4K-HDR") {
      setSelectedSeats4K(prev => prev.filter(s => s !== seatObject))
    } else if (type === "IMAX") {
      setSelectedSeatsIMAX(prev => prev.filter(s => s !== seatObject))
    } else if (type === "3D") {
      setSelectedSeats3D(prev => prev.filter(s => s !== seatObject))
    }

    setTotalTickets(prev => {
      return prev.map(ticket =>
        ticket.seatChoice === seatObject ? { ...ticket, seatChosen: false, seatChoice: null} : ticket
      )
    })
  }
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
                <Select onValueChange={setSelectedTime} defaultValue="12:00 AM">
                  <SelectTrigger className="w-[180px] h-[25px]">
                    <SelectValue placeholder="Select Time" />
                  </SelectTrigger>
                  <SelectContent>
                    {time.map((selectTime, index) => (<SelectItem value={selectTime} key={index}>{selectTime}</SelectItem>))}
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
                      <Select onValueChange={setPremiumType} defaultValue="4K-HDR">
                        <SelectTrigger className="w-[180px] h-[25px]">
                          <SelectValue placeholder="Select Screen Type" defaultValue={"4k-HDR"} />
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
                    <Card className="w-[260px] h-[175px]" key={index}>
                      <CardHeader className="flex flex-col gap-[1px]">
                        <CardTitle className="text-md mb-[-8px]">{`Ticket Number: ${index+1}`}</CardTitle>
                        <CardDescription className="font-semibold mb-[30px]">{`${ticket.ticketType}, ${ticket.screentype}`}</CardDescription>
                        <CardDescription className="font-semibold mb-[30px]">{ticket.time}</CardDescription>
                        <CardDescription className="font-semibold mb-[30px]">{`Auditorium: ${ticket.auditorium}`}</CardDescription>
                        <div className="mt-[10px]">
                        {!ticket.seatChosen ? ( <Button className="h-[20px] mt-[10px] w-fit" onClick={() => selectSeat(ticket.screentype)}>Select Seat</Button>) : (<p>{`Seat: ${ticket.seatChoice}`}</p>)}
                        </div>
                      </CardHeader>
                    </Card>
                    )
                  })}
                </div>
                <div className="w-full flex justify-center items-center">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  defaultValue="Standard"
                  className="w-fit flex flex-col items-center"
                >
                  <TabsList className="mb-4">
                    <TabsTrigger value="Standard">Regular</TabsTrigger>
                    <TabsTrigger value="4K-HDR">Premium-4K</TabsTrigger>
                    <TabsTrigger value="IMAX">Premium-IMAX</TabsTrigger>
                    <TabsTrigger value="3D">Premium-3D</TabsTrigger>
                  </TabsList>
                  <div className="relative w-full h-full">
                    <div className={activeTab === "Standard" ? "block" : "hidden"}>
                      <TheatrePreview
                        rows={standardRows}
                        selectedSeats={selectedSeatsStandard}
                        onSeatSelect={(seat) => handleSeatSelection(seat, "Standard")}
                        onSeatDeselect={(seat) => handleSeatDeselection(seat, "Standard")}
                        totalTickets={regularQuantity.length}
                      />
                    </div>
                    <div className={activeTab === "4K-HDR" ? "block" : "hidden"}>
                      <TheatrePreview
                        rows={rows4K}
                        selectedSeats={selectedSeats4K}
                        onSeatSelect={(seat) => handleSeatSelection(seat, "4K-HDR")}
                        onSeatDeselect={(seat) => handleSeatDeselection(seat, "4K-HDR")}
                        totalTickets={premiumQuantity.filter(p => p.screentype === "4K-HDR").length}
                      />
                    </div>
                    <div className={activeTab === "IMAX" ? "block" : "hidden"}>
                      <TheatrePreview
                        rows={IMAXrows}
                        selectedSeats={selectedSeatsIMAX}
                        onSeatSelect={(seat) => handleSeatSelection(seat, "IMAX")}
                        onSeatDeselect={(seat) => handleSeatDeselection(seat, "IMAX")}
                        totalTickets={premiumQuantity.filter(p => p.screentype === "IMAX").length}
                      />
                    </div>
                    <div className={activeTab === "3D" ? "block" : "hidden"}>
                      <TheatrePreview
                        rows={rows3D}
                        selectedSeats={selectedSeats3D}
                        onSeatSelect={(seat) => handleSeatSelection(seat, "3D")}
                        onSeatDeselect={(seat) => handleSeatDeselection(seat, "3D")}
                        totalTickets={premiumQuantity.filter(p => p.screentype === "3D").length}
                      />
                    </div>
                  </div>
                </Tabs>
              </div>
            </div>          
          </CardContent>
          <CardFooter className="flex flex-col justify-center items-center mt-8 gap-4">
            {totalTickets.length === 0 ? null : (() => {
              const allChosen = totalTickets.every(ticket => ticket.seatChosen);

              if (allChosen) {
                return (
                  <div className="flex flex-col items-center space-y-4 mt-8 w-full">
                    {availablePayments.length === 0 ? (
                      <>
                        {!showAddOptions ? (
                          <Button variant="outline" onClick={() => setShowAddOptions(true)}>
                            <Plus className="w-4 h-4 mr-2" /> Add Payment Method
                          </Button>
                        ) : (
                          <div className="flex gap-4">
                            <Button onClick={() => navigate("/payment/add-card")}>Add Card</Button>
                            <Button onClick={() => navigate("/payment/add-paypal")}>Add PayPal</Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 w-full">
                          {availablePayments.map((pay) => (
                            <Card
                              key={pay.payment_id}
                              className={`border p-4 cursor-pointer ${
                                selectedPayment === pay.payment_id ? "ring-2 ring-blue-500" : ""
                              }`}
                              onClick={() => setSelectedPayment(pay.payment_id)}
                            >
                              <CardTitle className="text-base">
                                {pay.type === "card" ? "Card" : "PayPal"}
                              </CardTitle>
                              <p className="text-sm mt-1">
                                {pay.type === "card" ? (
                                  <>
                                    {pay.details.card_type} •••• {pay.details.last4}
                                    <br />
                                    {pay.details.card_holder}
                                    <br />
                                    Expires:{" "}
                                    {pay.details.expiration_date
                                      ? new Date(pay.details.expiration_date).toLocaleDateString("en-GB")
                                      : "N/A"}
                                  </>
                                ) : (
                                  <>
                                    {pay.details.email_address}
                                    <br />
                                    {pay.details.phone_number || ""}
                                  </>
                                )}
                              </p>
                            </Card>
                          ))}
                        </div>

                        <div className="pt-4">
                          <Button onClick={() => setShowAddOptions(!showAddOptions)} variant="outline">
                            {showAddOptions ? "Cancel" : "Add Another Payment Method"}
                          </Button>
                          {showAddOptions && (
                            <div className="flex gap-4 mt-4">
                              <Button onClick={() => navigate("/payment/add-card")}>Add Card</Button>
                              <Button onClick={() => navigate("/payment/add-paypal")}>Add PayPal</Button>
                            </div>
                          )}
                        </div>

                        {/* Purchase button only shows once payment selected */}
                        {selectedPayment && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="mt-6">
                              Purchase Tickets
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Review Your Order</AlertDialogTitle>
                              <AlertDialogDescription className="space-y-4">

                                {/* Movie Info */}
                                <div>
                                  <p><strong>Movie:</strong> {movieName}</p>
                                  <p><strong>Date:</strong> {date}</p>
                                  <p><strong>Time:</strong> {selectTime}</p>
                                  <p><strong>Location:</strong> {location}</p>
                                </div>

                                {/* Ticket Info */}
                                <div className="mt-4">
                                  <strong>Tickets:</strong>
                                  <ul className="list-disc pl-6">
                                    {totalTickets.map((ticket, idx) => (
                                      <li key={idx}>
                                        {ticket.ticketType} — {ticket.screentype}, Seat: {ticket.seatChoice}, Auditorium: {ticket.auditorium}, Time: {ticket.time}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Payment Info */}
                                <div className="mt-4">
                                  <strong>Payment Method:</strong>
                                  <div className="ml-2">
                                    {(() => {
                                      const pay = availablePayments.find(p => p.payment_id === selectedPayment);
                                      if (!pay) return "N/A";
                                      return (
                                        <>
                                          {pay.type === "card" ? (
                                            <>
                                              {pay.details.card_type} •••• {pay.details.last4}<br />
                                              {pay.details.card_holder}<br />
                                              Expires: {new Date(pay.details.expiration_date).toLocaleDateString("en-GB")}
                                            </>
                                          ) : (
                                            <>
                                              {pay.details.email_address}<br />
                                              {pay.details.phone_number || ""}
                                            </>
                                          )}
                                        </>
                                      );
                                    })()}
                                  </div>
                                </div>

                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handlePurchase}>
                                Confirm and Purchase Tickets
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      </>
                    )}
                  </div>
                );
              }
              return null;
            })()}
          </CardFooter>
        </Card>
    </div>

  )
}

export default BookTicketPage