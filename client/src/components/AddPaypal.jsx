import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router";

const AddPaypal = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleAddPaypal = async () => {
    if (!email || !password || !cardNumber) {
      setFormError("All required fields must be filled.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      setFormError("Card number must be exactly 16 digits.");
      return;
    }

    setFormError("");

    try {
      const response = await fetch("http://localhost:3001/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          method: "paypal",
          status: true,
          cardNumber,
          paypal: {
            email_address: email,
            password,
            phone_number: phone || null,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Failed to add PayPal.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/users");
      }, 1500);

      setEmail("");
      setPassword("");
      setPhone("");
      setCardNumber("");
    } catch (err) {
      console.error("Add PayPal error:", err);
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
                PayPal added successfully!
              </div>
            </div>
          )}
          <CardTitle className="text-left">Link a PayPal Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </div>

          {/* Dummy Card Number */}
          <div>
            <Label htmlFor="card-number">Card Number (Required)</Label>
            <Input
              id="card-number"
              value={cardNumber}
              maxLength={16}
              inputMode="numeric"
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setCardNumber(onlyDigits);
              }}
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
          </div>

          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          <div className="flex items-center gap-4">
            <Button onClick={handleAddPaypal}>Add PayPal</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPaypal;
