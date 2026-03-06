"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/authcontext";
import { completeOnboarding } from "@/components/api";
import OnboardingTour from "@/components/(onboarding)/OnboardingTour";

export default function OnboardingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // If not logged in, redirect to signin
    if (!user) {
      router.replace("/signin");
      return;
    }

    // If onboarding already completed, skip to home
    if (user.onboardingCompleted !== false) {
      router.replace("/");
      return;
    }

    // Show the tour for users who haven't completed onboarding
    setShowTour(true);
  }, [user, isLoading, router]);

  const handleTourClose = async (completed: boolean) => {
    try {
      // Mark onboarding as completed on the server (whether finished or skipped)
      await completeOnboarding();
    } catch (err) {
      console.error("Failed to mark onboarding as completed:", err);
    }
    // Redirect to home page
    router.replace("/");
  };

  if (isLoading || !showTour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return <OnboardingTour isOpen={showTour} onClose={handleTourClose} />;
}
