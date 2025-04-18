import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminPage = ({children}) => {
  const [username, setUsername] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate()

  const handleLogin = async () => {

    if (!username || !password || !phonenum) {
      setFormError("Please fill out all fields.");
      return;
    }
    setFormError("");

    try {
      const response = await fetch(
        "http://localhost:3001/api/admin/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, phonenum }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Login failed.");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", data.admin.admin_id)
      navigate(`/admin/home/${data.admin.admin_id}`)
    } catch (error) {
      console.error("Login error:", error);
      setFormError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen px-4 pt-20">
      <Card className="w-full max-w-2xl mx-auto min-h-[450px] shadow-lg border">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 mt-2">
          {/* Username */}
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={phonenum}
              onChange={(e) => setPhonenum(e.target.value)}
            />
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
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {formError && <p className="text-destructive text-sm">{formError}</p>}

          {/* Login Button */}
          <div className="flex items-center gap-4">
            <Button onClick={handleLogin}>Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
