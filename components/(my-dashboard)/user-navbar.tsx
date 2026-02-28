"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdHome, MdPerson } from "react-icons/md";
import { toast } from "sonner";
import { useAuth } from "../context/authcontext";

const navLinks: { id: number; name: string; path: string }[] = [];

export function UserNavbar() {
  const { logout } = useAuth();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleBackToHome = () => router.push("/");
  const handleProfile = () => router.push("/user-profile");



  return (
    <header className="fixed top-0 -left-2 z-50 w-full border-b border-border bg-vulcan-white/80 dark:bg-vulcan-deep-navy/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-16">
        {/* Left: Logo + Dashboard */}
        <div className="flex items-center">
          <Link href="/" prefetch={false}>
            <Image
              src="/vulcans-logo.png"
              alt="vulcan-logo"
              width={100}
              height={100}
              priority
              className="cursor-pointer"
            />
          </Link>
          <span className="hidden sm:inline text-lg font-semibold text-foreground/80 dark:text-foreground/70">
            My Dashboard
          </span>
        </div>

        {/* Middle: Navigation Links (Removed as per user request) */}
        <div className="hidden md:flex justify-center items-center">
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
          {/* Home */}
          <button
            onClick={handleBackToHome}
            title="Home"
            className="p-2  transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
          >
            <MdHome size={24} />
          </button>

          {/* Profile */}
          <button
            onClick={handleProfile}
            title="Profile"
            className="p-2  transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
          >
            <MdPerson size={24} />
          </button>



          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-full transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-vulcan-white/95 dark:bg-vulcan-deep-navy/95 border-b border-border shadow-md py-5 transition-all duration-300">
          <div className="container mx-auto flex flex-col items-center space-y-5 px-4">


            <div className="flex justify-center space-x-6 mt-3">
              <button
                onClick={handleBackToHome}
                title="Home"
                className="p-2  transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
              >
                <MdHome size={24} />
              </button>
              <button
                onClick={handleProfile}
                title="Profile"
                className="p-2 transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
              >
                <MdPerson size={24} />
              </button>

            </div>
          </div>
        </div>
      )}
     
    </header>
  );
}