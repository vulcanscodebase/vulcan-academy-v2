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
