import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

const AdminPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen px-4 pt-20 bg-black text-foreground">
      <Card className="w-full max-w-2xl mx-auto min-h-[600px] shadow-lg border border-muted bg-card">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 mt-2">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="admin123"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 555-5555"
              value={phonenum}
              onChange={(e) => setPhonenum(e.target.value)}
            />
          </div>

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
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">Login</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
