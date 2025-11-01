
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import registration from "../public/registration.jpg";
import learning1 from "../public/learning1.jpg"

export function HowItWorks() {
  const steps = [
    { title: "Register and Login", content: "Signup for an account or log in to your existing account.", src: "/registration.jpg" },
    { title: "Choose a Course", content: "Select from a wide variety of skill-based courses designed to match your goals.", src: "/learning1.jpg" },
    { title: "Learn & Practice", content: "Engage with interactive lessons, real-world projects, and instant feedback.", src: "/images/learn.png" },
    { title: "Track Progress", content: "Monitor your growth with detailed analytics and personalized insights.", src: "/images/progress.png" },
  ];

  return (
    <section className="w-full py-20 md:py-32 lg:py-48 bg-background">
      <div className="container mx-auto items-center gap-12 px-4 md:px-6">
        <h2 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance md:px-12">
          How It Works
        </h2>
        <Carousel items={steps.map((step, index) => <Card key={index} index={index} card={step} layout />)} />
      </div>
    </section>
  );
}
