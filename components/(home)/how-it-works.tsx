
import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import registration from "../public/registration.jpg";
import learning1 from "../public/learning1.jpg"
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionExpand } from "@/components/ui/section-expand";

export function HowItWorks() {
  const steps = [
    { title: "Register and Login", content: "Signup for an account or log in to your existing account.", src: "/registration.jpg" },
    { title: "Purchase Vulcan Interview Master", content: "Purchase and get access to Vulcan Interview Master platform.", src: "/hero-section.png" },
    { title: "Learn and Practice", content: "Engage with interactive interview sessions and practice with real-world scenarios.", src: "/learning1.jpg" },
    { title: "Track Progress", content: "Monitor your growth with detailed analytics and personalized insights from your interview reports.", src: "/learning.jpg" },
  ];

  return (
    <SectionExpand className="bg-background">
      <div className="container mx-auto items-center gap-8 px-4 md:px-6 w-full">
        <ScrollReveal>
        <h2 className="mb-6 text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance md:px-12">
          How It Works
        </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
        <Carousel items={steps.map((step, index) => <Card key={index} index={index} card={step} layout />)} />
        </ScrollReveal>
      </div>
    </SectionExpand>
  );
}
