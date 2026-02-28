"use client";

import { CreditsDashboard } from "@/components/(my-dashboard)/credits";
import { useAuth } from "@/components/context/authcontext";
import { useLicenseCart } from "@/components/context/LicenseCartContext";
import { getUserTransactionsApi } from "@/components/api/paymentApi";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboardLanding() {
  const { user } = useAuth();
  const { toggleCart, addLicenses } = useLicenseCart();

  const [hasTransactions, setHasTransactions] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const balance = (user as any)?.licenses || 0;

  useEffect(() => {
    // Only check transactions if they have 0 balance. 
    // If they have > 0 balance, they obviously bought credits before.
    if (balance > 0) {
      setHasTransactions(true);
      setLoading(false);
      return;
    }

    const checkHistory = async () => {
      try {
        const res = await getUserTransactionsApi(1, 1);
        if (res?.data && res.data.length > 0) {
          setHasTransactions(true);
        } else {
          setHasTransactions(false);
        }
      } catch (error) {
        console.error("Failed to check transaction history", error);
        // Default to showing dashboard on error just in case
        setHasTransactions(true);
      } finally {
        setLoading(false);
      }
    };

    checkHistory();
  }, [balance]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4 w-full max-w-md">
          <Skeleton className="h-12 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md mt-6" />
        </div>
      </div>
    );
  }

  // If they have strictly 0 credits AND have NEVER made a transaction:
  if (balance === 0 && hasTransactions === false) {
    if (typeof window !== "undefined") {
      window.location.href = "/interview";
    }
    return null;
  }

  // Otherwise, show the normal dashboard (either they have credits > 0, or they have 0 but have bought before)
  return <CreditsDashboard />;
}