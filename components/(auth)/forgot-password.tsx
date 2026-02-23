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

export function ForgotPassword() {
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
          <form className="flex flex-col gap-4">
            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                className="w-full py-2"
              />
            </div>

            {/* Send Button */}
            <Button
              type="submit"
              className={cn(
                "bg-vulcan-accent-blue text-white hover:bg-vulcan-accent-blue/90",
                "rounded-md px-4 py-2 text-sm font-medium transition-colors w-full",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vulcan-accent-blue",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              Send
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
