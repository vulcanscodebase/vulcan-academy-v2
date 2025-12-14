"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Menu,
  X,
  ShoppingCart,
  LogOut,
  User,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/authcontext";
import { useCart } from "../context/cartcontext";
import { toast } from "sonner";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const { token, logout, user } = useAuth();
  const { setIsCartOpen, getTotalItems } = useCart();

  const [confirmMsg, setConfirmMsg] = useState("");
  const [availableCredits, setAvailableCredits] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      const userLicenses = (user as any).licenses;
      if (userLicenses !== undefined && userLicenses !== null) {
        setAvailableCredits(Number(userLicenses));
      }
    }
  }, [user]);

  const handleLogoutClick = () => {
    setIsConfirmModalOpen(true);
    setConfirmMsg("Are you sure you want to logout?");
    // setIsConfirmModalOpen(true);
  };

  const handleConfirmLogout = async () => {
    setIsConfirmModalOpen(false);
    await logout();
    toast.success("Logged out successfully!");
  };

  const handleCartIconClick = () => {
    setIsCartOpen(true);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Vulcans Interview", href: "/vulcans-interview-master" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const authenticatedNavLinks = [
    { name: "Reports", href: "/user-profile/interviews" },
  ];

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-border bg-vulcan-white/80 dark:bg-vulcan-deep-navy/80 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6 lg:px-16">
        {/* Logo */}
        <Link href="/" prefetch={false}>
          <Image
            src="/vulcans-logo.png"
            alt="vulcan-logo"
            width={100}
            height={100}
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 justify-center items-center space-x-10 lg:space-x-14">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === link.href
                : pathname === link.href ||
                  pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors pb-1 border-b-2 ${
                  isActive
                    ? "text-vulcan-accent-blue border-vulcan-accent-blue"
                    : "text-foreground/70 border-transparent hover:text-vulcan-accent-blue"
                }`}
                prefetch={false}
              >
                {link.name}
              </Link>
            );
          })}
          {token &&
            authenticatedNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === link.href
                  : pathname === link.href ||
                    pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors pb-1 border-b-2 ${
                    isActive
                      ? "text-vulcan-accent-blue border-vulcan-accent-blue"
                      : "text-foreground/70 border-transparent hover:text-vulcan-accent-blue"
                  }`}
                  prefetch={false}
                >
                  {link.name}
                </Link>
              );
            })}
        </div>

        {/* Right */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          {/* {isMounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-foreground/70 hover:bg-accent hover:text-accent-foreground"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )} */}

          {/* Auth Buttons / User Icons */}
          {!token ? (
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/signin" prefetch={false}>
                <Button
                  variant="outline"
                  className="border dark:border-vulcan-accent-blue text-vulcan-accent-blue hover:bg-vulcan-accent-blue hover:text-vulcan-white"
                >
                  Sign In
                </Button>
              </Link>
              {/* <Link href="/signup" prefetch={false}>
                <Button className="bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90">
                  Sign Up
                </Button>
              </Link> */}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-3">
              {/* Available Interviews Button */}
              <Button
                variant="outline"
                className="flex items-center gap-2 border-vulcan-accent-blue text-vulcan-accent-blue hover:bg-vulcan-accent-blue hover:text-white"
                onClick={() => router.push("/interview")}
              >
                <ClipboardList className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Take Interview • {availableCredits} left
                </span>
              </Button>

              {/* <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/user-dash")}>
                <LayoutDashboard className="h-5 w-5" />
              </Button> */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/user-profile")}
              >
                <User className="h-5 w-5" />
              </Button>
              {/* <Button
                variant="ghost"
                size="icon"
                onClick={handleCartIconClick}
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-vulcan-accent-blue text-[10px] text-white font-medium">
                  {getTotalItems()}
                </span>
              </Button> */}
              <Button variant="ghost" size="icon" onClick={handleLogoutClick}>
                <LogOut className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground/70 hover:bg-accent hover:text-accent-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-vulcan-white/95 dark:bg-vulcan-deep-navy/95 border-b border-border shadow-md py-6 transition-all duration-300">
          <div className="container mx-auto flex flex-col items-center space-y-6 px-4">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === link.href
                  : pathname === link.href ||
                    pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg transition-colors pb-1 border-b-2 ${
                    isActive
                      ? "text-vulcan-accent-blue border-vulcan-accent-blue"
                      : "text-foreground/80 border-transparent hover:text-vulcan-accent-blue"
                  }`}
                  prefetch={false}
                >
                  {link.name}
                </Link>
              );
            })}
            {token &&
              authenticatedNavLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === link.href
                    : pathname === link.href ||
                      pathname.startsWith(link.href + "/");
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg transition-colors pb-1 border-b-2 ${
                      isActive
                        ? "text-vulcan-accent-blue border-vulcan-accent-blue"
                        : "text-foreground/80 border-transparent hover:text-vulcan-accent-blue"
                    }`}
                    prefetch={false}
                  >
                    {link.name}
                  </Link>
                );
              })}

            {!token ? (
              <div className="flex flex-col space-y-3 mt-4 w-full max-w-xs">
                {/* <Link 
                href="/signup" 
                prefetch={false}>
                  <Button className="bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90 w-full">
                    Sign Up
                  </Button>
                </Link> */}
                <Link href="/signin" prefetch={false}>
                  <Button
                    variant="outline"
                    className="border-vulcan-accent-blue text-vulcan-accent-blue hover:bg-vulcan-accent-blue hover:text-white w-full"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6 mt-4">
                {/* Available Interviews Link */}
                <div
                  onClick={() => {
                    router.push("/interview");
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-vulcan-accent-blue hover:text-vulcan-accent-blue/80 cursor-pointer transition-colors"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span className="text-lg font-medium">
                    Take Interview • {availableCredits} left
                  </span>
                </div>

                <div className="flex justify-center space-x-6">
                  {/* <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/user-dash")}>
                    <LayoutDashboard className="h-5 w-5" />
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push("/user-profile")}
                  >
                    <User className="h-5 w-5" />
                  </Button>
                  {/* <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCartIconClick}
                    className="relative"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-vulcan-accent-blue text-[10px] text-white font-medium">
                      {getTotalItems()}
                    </span>
                  </Button> */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogoutClick}
                  >
                    <LogOut className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Logout Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 top-20 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-vulcan-deep-navy p-6 rounded-lg shadow-lg w-80">
            <p className="text-center mb-4">{confirmMsg}</p>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
