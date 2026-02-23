"use client";

import { useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import { resetPassword } from "@/components/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(token, { password });
            toast.success("Password reset successfully! Redirecting to sign in...");
            setTimeout(() => {
                router.push("/signin");
            }, 2000);
        } catch (error: any) {
            console.error("Reset password error:", error);
            toast.error(
                error.response?.data?.message || "Failed to reset password. Link may be expired."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="space-y-4">
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
                        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Enter your new password below
                        </p>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="********"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-vulcan-accent-blue text-white font-bold hover:bg-vulcan-accent-blue/90"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Resetting Password...
                                </>
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Toaster richColors position="top-center" />
            <ResetPasswordForm />
        </Suspense>
    );
}
