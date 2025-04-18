import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../AuthContext";

const ChangePasswordPage = () => {
  const { token, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setFormError("All fields are required.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setFormError("New passwords do not match.");
      return;
    }
    
    if (currentPassword === newPassword) {
      setFormError("New password must be different from the current password.");
      return;
    }    

    setFormError("");

    try {
      const response = await fetch("http://localhost:3001/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error || "Failed to change password.");
        return;
      }

      setChangeSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = "/users";
      }, 2000);
    } catch (error) {
      console.error("Change password error:", error);
      setFormError("Something went wrong. Try again.");
    }
  };

  useEffect(() => {
    if (changeSuccess) {
      const timeout = setTimeout(() => setChangeSuccess(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [changeSuccess]);

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <Card>
        <CardHeader className="space-y-2">
          {changeSuccess && (
            <div className="flex justify-center">
              <div className="px-4 py-2 bg-white text-black text-base font-medium rounded shadow-md">
                Password changed successfully!
              </div>
            </div>
          )}
          <CardTitle className="text-left">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Password */}
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center"
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute inset-y-0 right-2 flex items-center"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {formError && <p className="text-red-500 text-sm">{formError}</p>}

          {/* Submit */}
          <div className="flex items-center gap-4">
            <Button onClick={handleChangePassword}>Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
