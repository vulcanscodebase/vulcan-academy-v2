"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { handleGoogleCallback, handleGoogleSignIn } from "@/utils/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../context/authcontext";

export function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const { register } = useAuth();
  const router = useRouter();

  // ✅ Validate all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    if (formData.password !== confirmPassword)
      newErrors.confirmPassword = "Passwords don't match.";
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";

    return newErrors;
  };

  // Google callback handling
  useEffect(() => {
    if (window.location.href.includes("google/callback")) {
      handleGoogleCallback();
    }
  }, []);

  // Handle change for all inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    setError({});
  };

  //  Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    setLoading(true);

    const validationErrors = validateForm();
    setError(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      toast.success("Registered successfully! Please check your email for verification link. ");
      setFormData({ name: "", dob: "", email: "", password: "" });
      setConfirmPassword("");
      // router.push("/");
    } catch (err) {
      toast.error("Something went wrong during signup");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //  Toggle password visibility
  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div className="w-full max-w-sm">
      <Card className="w-full shadow-xl">
        <CardHeader className="space-y-3">
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
            <CardTitle className="text-xl font-bold">Sign Up</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {/* Error Messages (field-specific) */}
          {Object.keys(error).length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              {Object.values(error).map((msg, index) => (
                <p key={index} className="text-sm text-red-600">
                  {msg}
                </p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Name */}
            <div className="grid gap-1">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                minLength={3}
                required
              />
            </div>

            {/* DOB */}
            <div className="grid gap-1">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="grid gap-1 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword.password ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-7 text-gray-500"
              >
                {showPassword.password ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="grid gap-1 relative">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={handleChange}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-7 text-gray-500"
              >
                {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className={cn(
              "w-full rounded-md px-4 py-2 text-sm font-medium transition-colors flex items-center justify-center",
              "border-gray-300 bg-white hover:bg-gray-50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vulcan-accent-blue"
            )}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="text-vulcan-accent-blue font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
