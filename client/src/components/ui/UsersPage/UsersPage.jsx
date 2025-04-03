import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Ticket, User } from "lucide-react";
import { Link } from "react-router-dom";

const UsersPage = () => {
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
            {[1, 2, 3].map((ticket) => (
              <Card key={ticket} className="mb-4">
                <CardHeader>
                  <CardTitle>Movie Name #{ticket}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p>Purchase Date: 2025-04-01</p>
                    <p>Date: 2025-04-05</p>
                    <p>Time: 7:00 PM</p>
                    <p>Theatre_location, Auditorium_number</p>
                    <p>Seats: A{ticket}, B{ticket}</p>
                    <p>Recliner_seat</p>

                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Modify</Button>
                    <Button>Refund</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Username */}
              <div>
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="johnny123" />
              </div>

              {/* First and Last Name */}
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" defaultValue="John" />
                </div>
                <div className="w-1/2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" defaultValue="Doe" />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="john@example.com" />
              </div>

              {/* Phone Number */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+1 234 567 8900" />
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-4">
                <Button>Save Changes</Button>
                <Link to="/change-password">
                  <Button variant="outline">Change Password</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UsersPage;
