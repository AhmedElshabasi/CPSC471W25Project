import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

const AddCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expirationDate, setExpirationDate] = useState(null);
  const [cardType, setCardType] = useState("Credit"); // or Debit
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const [expirationInput, setExpirationInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/users";


  const handleInputChange = (e) => {
    const value = e.target.value;
    setExpirationInput(value);

    // Only parse and update when format is valid
    const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (datePattern.test(value)) {
        const [day, month, year] = value.split("-");
        const parsed = new Date(`${year}-${month}-${day}`);
        if (!isNaN(parsed)) {
        setExpirationDate(parsed);
        }
    }
    };


  const handleAddCard = async () => {
    if (!expirationDate) {
      setFormError("Please pick an expiration date.");
      return;
    }
  
    const formattedDate = format(expirationDate, "yyyy-MM-dd");
    const today = new Date();
    const isExpired = expirationDate < today;
  
    setFormError(""); // clear any previous error
  
    try {
      const response = await fetch("http://localhost:3001/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          method: "card",
          status: !isExpired, // true if NOT expired
          cardNumber,
          card: {
            expiration_date: formattedDate,
            card_type: cardType,
            cvv,
            card_holder: cardHolder,
          },
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setFormError(data.error || "Failed to add card.");
        return;
      }
  
      setSuccess(true);

      setTimeout(() => {
        navigate(from);
      }, 1500); // slight delay to show "Card added" toast
      // Reset form
      setCardNumber("");
      setCvv("");
      setCardHolder("");
      setCardType("Credit");
      setExpirationDate(null);
    } catch (error) {
      console.error("Add card error:", error);
      setFormError("An unexpected error occurred.");
    }
  };
  

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader className="space-y-2">
          {success && (
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-white text-black text-base font-medium rounded shadow-md">
                Card added successfully!
              </div>
            </div>
          )}
          <CardTitle className="text-left">Add a New Card</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Card Number */}
          <div>
            <Label htmlFor="card-number">Card Number</Label>
            <Input
                id="card-number"
                value={cardNumber}
                onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, ""); // remove non-digits
                    setCardNumber(digitsOnly);
                }}
                maxLength={16}
                />
          </div>

         {/* Expiration Date */}
            <div>
            <Label htmlFor="expiration-date">Expiration Date</Label>
            <div className="relative">
                <Input
                    id="expiration-date"
                    placeholder="dd-mm-yyyy"
                    inputMode="numeric"
                    maxLength={10}
                    className="pr-10"
                    value={expirationInput}
                    onChange={handleInputChange}
                    />
            </div>
            </div>

          {/* CVV */}
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              maxLength={4}
            />
          </div>

          {/* Card Holder */}
          <div>
            <Label htmlFor="card-holder">Card Holder</Label>
            <Input
              id="card-holder"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
            />
          </div>

          {/* Card Type */}
            <div>
            <Label htmlFor="card-type">Card Type</Label>
            <select
                id="card-type"
                className="w-full border rounded p-2 bg-black text-white"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
            >
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
            </select>
            </div>


          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <div className="flex items-center gap-4">
            <Button onClick={handleAddCard}>Add Card</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCard;
