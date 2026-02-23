"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "../api";
import { toast } from "sonner";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword({ email });
      if (response.status === 200) {
        toast.success("Password reset link has been sent to your email.");
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      const message = error.response?.data?.message || "Failed to send reset link. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Card className="w-full shadow-xl">
        <CardHeader className="space-y-3">
          {/* Vulcan logo */}
          <div className="flex justify-center">
            <Image
              src="/vulcans-logo.png"
              alt="Vulcan Logo"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
          <div className="text-center">
            <CardTitle className="text-xl font-bold">
              Forgot Password
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Enter your email to reset your password
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="w-full py-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "bg-vulcan-accent-blue text-white hover:bg-vulcan-accent-blue/90",
                "rounded-md px-4 py-2 text-sm font-medium transition-colors w-full",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vulcan-accent-blue",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>

          {/* Back to Signin link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                href="/signin"
                className="text-vulcan-accent-blue font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
