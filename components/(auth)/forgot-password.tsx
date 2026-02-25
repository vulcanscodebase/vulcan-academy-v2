"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { forgotPassword, resetPassword } from "@/components/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface ForgotPasswordProps {
  token?: string;
}

export function ForgotPassword({ token }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const isResetMode = !!token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isResetMode) {
      if (!password || password.length < 8) {
        toast.error("Password must be at least 8 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }

      try {
        setLoading(true);
        await resetPassword(token as string, { password });
        toast.success("Password reset successfully! Redirecting to sign in...");
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } catch (error: any) {
        console.error("Reset password error:", error);
        toast.error(
          error.response?.data?.message || "Failed to reset password. Please try again."
        );
      } finally {
        setLoading(false);
      }
    } else {
      if (!email) {
        toast.error("Please enter your email address.");
        return;
      }

      try {
        setLoading(true);
        await forgotPassword({ email });
        toast.success("Password reset link sent! Please check your email inbox.");
        setEmail("");
      } catch (error: any) {
        console.error("Forgot password error:", error);
        toast.error(
          error.response?.data?.message || "Failed to send reset link. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Toaster richColors position="top-center" />
      <Card className="w-full shadow-xl border-none">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/vulcans-logo.png"
              alt="Vulcan Logo"
              width={150}
              height={150}
              priority
              className="rounded-full h-auto w-auto"
            />
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isResetMode ? "Reset Password" : "Forgot Password"}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {isResetMode
                ? "Create a new secure password for your account"
                : "Enter your email to reset your password"}
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isResetMode ? (
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
              </div>
            ) : (
              <>
                <div className="grid gap-2 relative">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                    disabled={loading}
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-[2.3rem] text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                    disabled={loading}
                    minLength={8}
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "bg-vulcan-accent-blue text-white hover:bg-vulcan-accent-blue/90",
                "rounded-md h-11 text-sm font-medium transition-all w-full mt-2",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                  {isResetMode ? "Resetting..." : "Sending..."}
                </>
              ) : (
                isResetMode ? "Reset Password" : "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              {isResetMode ? (
                <Link href="/signin" className="text-vulcan-accent-blue font-medium hover:underline">
                  Back to Sign in
                </Link>
              ) : (
                <>
                  Remember your password?{" "}
                  <Link href="/signin" className="text-vulcan-accent-blue font-medium hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
