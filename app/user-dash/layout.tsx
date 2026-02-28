"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/authcontext";
import { Loader2, Lock, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNavbar } from "@/components/(my-dashboard)/user-navbar";
import { useLicenseCart } from "@/components/context/LicenseCartContext";

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toggleCart, addLicenses } = useLicenseCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [user, isLoading, router]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-vulcan-accent-blue" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const isSubscribed = (user as any).licenses && (user as any).licenses > 0;

  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <UserNavbar />
        <main className="flex-1 flex flex-col items-center justify-center p-6 mt-16 text-center">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-blue-50 text-vulcan-accent-blue rounded-full justify-center flex items-center mb-6">
              <Lock className="w-10 h-10" />
            </div>
            
            <h1 className="text-2xl font-bold text-vulcan-primary mb-3">
              Dashboard Locked
            </h1>
            
            <p className="text-gray-500 mb-8 leading-relaxed">
              This section is exclusively for subscribed members of Vulcan Prep 360. 
              Purchase interview licenses to unlock full access to your performance metrics, 
              reports, and dashboard analytics.
            </p>

            <Button
              className="w-full bg-vulcan-accent-blue hover:bg-vulcan-primary text-white h-12 rounded-xl text-base font-medium transition-all shadow-md group"
              onClick={() => {
                addLicenses(1);
                toggleCart();
              }}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Subscribe Now
              <ArrowRight className="w-5 h-5 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Button>
            
            <button 
              onClick={() => router.push("/")}
              className="mt-6 text-sm text-gray-500 hover:text-vulcan-primary font-medium"
            >
              Return to Homepage
            </button>
          </div>
        </main>
      </div>
    );
  }

  // Subscribed! Render exactly as normal
  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}
