"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";
import { MdHome, MdLogout } from "react-icons/md";
import { toast } from "sonner";
import { useAuth } from "../context/authcontext";

const navLinks = [
  // { id: 1, name: "Courses", path: "courses" },
  // { id: 2, name: "Tests", path: "mytests" },
  { id: 3, name: "Prep 360", path:"interview-master"}
];

export function UserNavbar() {
  const { logout } = useAuth();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState("");

  const handleBackToHome = () => router.push("/");
  const handleProfile = () => router.push("/user-profile");

  const handleLogoutClick = async () => {
    setConfirmMsg("Are you sure you want to logout?");
    setIsConfirmModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsConfirmModalOpen(false);
    await logout();
    toast.success("Logged out!");
    router.push("/signin");
  };

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

        {/* Middle: Navigation Links */}
        <div className="hidden md:flex justify-center items-center">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={`/user-dash/${link.path}`}
              className="text-foreground/70 hover:text-vulcan-accent-blue text-[15px] font-medium transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
          {/* Home */}
          <button
            onClick={handleBackToHome}
            title="Home"
            className="p-2  transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
          >
            <MdHome size={22} />
          </button>

          {/* Profile */}
          <button
            onClick={handleProfile}
            title="Profile"
            className="p-2  transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
          >
            <FaUser size={20} />
          </button>

          {/* Logout */}
          <button
            onClick={handleLogoutClick}
            title="Logout"
            className="p-2 rounded-3xl transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 text-foreground/70"
          >
            <MdLogout size={22} />
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
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={`/user-dash/${link.path}`}
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground/80 hover:text-vulcan-accent-blue text-base font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="flex justify-center space-x-6 mt-3">
              <button
                onClick={handleBackToHome}
                title="Home"
                className="p-2  transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
              >
                <MdHome size={22} />
              </button>
              <button
                onClick={handleProfile}
                title="Profile"
                className="p-2 transition-all duration-200 hover:bg-vulcan-accent-blue/10 hover:text-vulcan-accent-blue text-foreground/70"
              >
                <FaUser size={20} />
              </button>
              <button
                onClick={handleConfirmLogout}
                title="Logout"
                className="p-2  transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 text-foreground/70"
              >
                <MdLogout size={22} />
              </button>
            </div>
          </div>
        </div>
      )}
     
    </header>
  );
}