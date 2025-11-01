"use client";

import Image from "next/image";
import Link from "next/link";
import { MdDashboard } from "react-icons/md";
import { useAuth } from "../context/authcontext";
import { Button } from "@/components/ui/button";

export function ProfileHeader() {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-border bg-vulcan-white/80 dark:bg-vulcan-deep-navy/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-16">
        {/* Left: Logo + Welcome */}
        <div className="flex items-center gap-4">
          <Link href="/" prefetch={false}>
          <Image
            src="/vulcans-logo.png"
            alt="vulcan-logo"
            width={100}
            height={100}
            priority
          />
        </Link>
          <span className="text-lg font-medium text-foreground/80 dark:text-foreground/70">
            Welcome {user?.name}!
          </span>
        </div>

        {/* Right: Dashboard + Back */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground/70 hover:text-vulcan-accent-blue"
            title="Dashboard"
            asChild
          >
            <Link href="/user-dash">
              <MdDashboard className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
