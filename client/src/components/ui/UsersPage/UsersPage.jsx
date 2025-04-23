import React, { useState,useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Ticket, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../AuthContext"
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
import { useNavigate } from "react-router-dom";
import { Trash2, Plus } from "lucide-react";


const UsersPage = () => {
  const { user, token, isLoggedIn, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [payments, setPayments] = useState([]);
  const [combinedPayments, setCombinedPayments] = useState([]);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);

  useEffect(() => {
    const fetchTicketsAndSeats = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/ticket", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch tickets");
        }
  
        // Fetch seat details for each ticket
        const seatPromises = data.map((ticket) =>
          fetch(`http://localhost:3001/api/ticket/seat/${ticket.seat_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json())
        );
  
        const seatData = await Promise.all(seatPromises);
  
        // Map seat_id to seat details
        const seatMap = {};
        seatData.forEach((seat) => {
          seatMap[seat.seat_id] = seat;
        });
  
        // Attach seat details to tickets
        const ticketsWithSeatInfo = data.map((ticket) => ({
          ...ticket,
          seatInfo: seatMap[ticket.seat_id],
        }));
  
        setTickets(ticketsWithSeatInfo);
      } catch (err) {
        console.error("Error fetching tickets or seats:", err);
        setTickets([]); // fallback to empty
      } finally {
        setLoadingTickets(false);
      }
    };
  
    if (token) fetchTicketsAndSeats();
  }, [token, tickets]);

const handleRefund = async (ticketId, ticketType) => {
  try {
    const response = await fetch(`http://localhost:3001/api/ticket/${ticketId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ticketType: ticketType.toLowerCase() }),
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Invalid JSON returned.");
    }

    if (!response.ok) {
      throw new Error(data.error || "Failed to refund ticket.");
    }

    alert("Ticket refunded successfully.");

  } catch (err) {
    console.error("Refund error:", err);
    alert(err.message || "An error occurred while processing the refund.");
  }
};

  const fetchPayments = async () => {
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
  
      const { payments, cards, paypals } = data;
  
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
      
        return null; // fallback in case data mismatch
      }).filter(Boolean); // remove any nulls      
  
      setCombinedPayments(merged);
    } catch (err) {
      console.error("Fetch payment error:", err);
    }
  };
  
  
  useEffect(() => {
    if (token) fetchPayments();
  }, [token]);  

  const handleDeletePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/payment/${paymentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        fetchPayments();
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete payment.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the payment.");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setUsername(data.username || "");
          setFirstname(data.firstname || "");
          setLastname(data.lastname || "");
          setEmail(data.email || "");
          setPhonenum(data.phonenum || "");
        } else {
          console.error("Error fetching user profile:", data.error);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
  
    if (token) {
      fetchProfile();
    }
  }, [token]);
  

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          phonenum,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }
      setUpdateSuccess(true);

    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  

  const handleDeleteAccount = async () => {
      try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }
      logout(); // clear token from context/localStorage
      window.location.href = "/";
    } catch (error) {
      console.error("Delete failed:", error);
      alert("An error occurred while deleting your account.");
    }
  };  

  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000); // 3 seconds
  
      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [updateSuccess]);



  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tickets" className="flex items-center gap-2 justify-center">
            <Ticket className="w-4 h-4" /> My Tickets
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2 justify-center">
            <User className="w-4 h-4" /> Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4">
          {loadingTickets ? (
            <p>Loading your tickets...</p>
          ) : tickets.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No tickets booked yet.</div>
          ) : (
            tickets.map((ticket, idx) => (
              <Card key={ticket.ticket_id} className="mb-4">
                <CardHeader>
                  <CardTitle>
                    {ticket.movie_name || "Untitled Movie"} — {ticket.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div className="text-sm space-y-1">
                  <p><strong>Purchase Date:</strong> {ticket.purchase_date?.split("T")[0]}</p>
                    <p><strong>Time:</strong> {ticket.movie_time && (() => {
                      const [hours, minutes] = ticket.movie_time.split(":");
                      const date = new Date();
                      date.setHours(parseInt(hours), parseInt(minutes));
                      return date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      });
                    })()}</p>

                    <p><strong>Theatre:</strong> {ticket.theatre_location}, Auditorium {ticket.auditorium_number}</p>
                    <p><strong>Seat:</strong> {ticket.seatInfo ? `${ticket.seatInfo.row}-${ticket.seatInfo.number}` : ticket.seat_id}</p>
                    {ticket.type === "Regular" && (
                      <p><strong>Recliner:</strong> {ticket.recliner_seat ? "Yes" : "No"}</p>
                    )}
                    {ticket.type === "Premium" && (
                      <>
                        <p><strong>Screen Type:</strong> {ticket.screen_type}</p>
                        <p><strong>Seat Type:</strong> {ticket.seat_type}</p>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button>Refund</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Refund</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to refund this ticket? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleRefund(ticket.ticket_id, ticket.type)}
                        >
                          Yes, Refund
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </ScrollArea>
      </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="space-y-2">
              {updateSuccess && (
                <div className="flex justify-center transition-opacity duration-500 ease-in-out opacity-100">
                  <div className="px-4 py-2 bg-white text-black text-base font-medium rounded shadow-md">
                    Profile details modified successfully!
                  </div>
                </div>
              )}
              <CardTitle className="text-left">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Username */}
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>

              {/* First and Last Name */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={phonenum} onChange={(e) => setPhonenum(e.target.value)} />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <Button onClick={handleUpdateProfile}>Save Changes</Button>
                <Link to="/users/change-password">
                  <Button variant="outline">Change Password</Button>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Account</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. Your account will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleDeleteAccount}
                      >
                        Yes, delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {combinedPayments.length === 0 ? (
                <div className="flex flex-col items-center">
                  {!showAddOptions ? (
                    <Button variant="outline" onClick={() => setShowAddOptions(true)}>
                      <Plus className="w-4 h-4 mr-2" /> Add Payment
                    </Button>
                  ) : (
                    <div className="flex gap-4">
                      <Button onClick={() => navigate("/payment/add-card")}>Add Card</Button>
                      <Button onClick={() => navigate("/payment/add-paypal")}>Add PayPal</Button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                    {combinedPayments.map((pay) => (
                      <Card key={pay.payment_id} className="border p-4">
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="mt-3">
                              <Trash2 className="w-4 h-4 mr-1" /> Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Payment Method?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the selected {pay.type === "card" ? "card" : "PayPal account"} from your account. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeletePayment(pay.payment_id)}
                              >
                                Yes, delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersPage;
