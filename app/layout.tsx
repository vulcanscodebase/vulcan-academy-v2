"use client";
import type React from "react"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider" // Import ThemeProvider
import { Navbar } from "@/components/(layout-wrapper)/navbar";
// import { Footer } from "@/components/footer"
import { useLenis } from "@/hooks/useLenis"
import { Toaster } from "sonner"
import { AuthProvider } from "@/components/context/authcontext";
import { CartProvider } from "@/components/context/cartcontext";
import { usePathname } from "next/navigation";
import Cart from "@/components/(cart)/cart";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const metadata = {
  title: "Vulcan Academy",
  description: "Effortless, Seamless, Elegant, Beautiful, Intuitive, Powerful, Polished, Refined, Magical.",
}

export default function RootLayout({children,}: Readonly<{children: React.ReactNode}>) {
  useLenis() //initialzed lenis globally
  const pathname= usePathname();
  const hideNavbar = pathname === "/signin" || pathname === "/signup" || pathname === "/user-dash" || pathname?.startsWith("/super-admin");
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" disableTransitionOnChange>
            {/*Navbar will visible on all pages*/}
            <AuthProvider >
              <CartProvider>

            {!hideNavbar && <Navbar /> }
            
            < Cart />
           

            {/*page specific content will be render here*/}
            {children}
            </CartProvider>
            </AuthProvider>
            <Toaster position="top-center" richColors closeButton />

            {/*Footer will visible on all pages*/}
            
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
