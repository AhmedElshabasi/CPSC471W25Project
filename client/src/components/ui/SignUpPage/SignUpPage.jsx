import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const SignUpPage = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCreateAccount = async () => {
    if (!username || !password || !firstname || !lastname || !password) {
      console.log(`username: ${username}, password: ${password}, phonenum: ${phonenum}, confirm: ${confirmPassword}`);
      setFormError("Please fill out all required fields.");
      return;
    }

    // Reset the error state
    setFormError("");

    try {
        const response = await fetch("http://localhost:3001/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            firstname,
            lastname,
            email,
            phonenum,
            password,
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setFormError(errorData.error || "Failed to create account.");
          return;
        }
  
        const data = await response.json();
        console.log("Account created:", data);
      } catch (error) {
        console.log(`in the error: username: ${username}, password: ${password}, phonenum: ${phonenum}`);
        console.error("Error creating account:", error);
        setFormError("An unexpected error occurred. Please try again.");
      }
    };   

    return (
        <div className="min-h-screen p-6 max-w-5xl mx-auto">
            <Card>
            <CardHeader>
              <CardTitle>Sign up</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Username */}
              <div>
                <Label htmlFor="username">Username</Label>
                <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)} />
              </div>

              {/* First and Last Name */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input 
                  id="first-name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)} />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input 
                  id="last-name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)} />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                id="phone"
                value={phonenum}
                onChange={(e) => setPhonenum(e.target.value)} />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <Button onClick={handleCreateAccount}>
                  Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    );};

    export default SignUpPage;