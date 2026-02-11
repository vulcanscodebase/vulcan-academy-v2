"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { handleGoogleCallback, handleGoogleSignIn } from "@/utils/auth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { useAuth } from "../context/authcontext";

export function Signin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  // const router = useRouter();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.password.trim()) newErrors.password = "Password is required.";
    return newErrors;
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname.includes("/google/callback")) {
      handleGoogleCallback();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setError({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true);
        await login(formData);
        toast.success("Login Successful!");
        setFormData({ email: "", password: "" });
      } catch (err: any) {
        toast.error("Invalid credentials");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-sm">
      <Card className="w-full shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <Image src="/vulcans-logo.png" alt="Vulcan Logo" width={150} height={150} className="rounded-full" />
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          {Object.values(error).length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              {error.email && <p className="text-sm text-red-600">{error.email}</p>}
              {error.password && <p className="text-sm text-red-600">{error.password}</p>}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm text-vulcan-accent-blue hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-[2.3rem] text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={cn(
                "bg-vulcan-accent-blue text-white hover:bg-vulcan-accent-blue/90 rounded-md px-4 py-2 text-sm font-medium w-full disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-vulcan-accent-blue font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
