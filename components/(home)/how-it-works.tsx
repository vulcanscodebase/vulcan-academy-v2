import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import registration from "../public/registration.jpg";
import learning1 from "../public/learning1.jpg";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionExpand } from "@/components/ui/section-expand";

export function HowItWorks() {
  const steps = [
    {
      title: "Register & Log In",
      content:
        "Create your account in seconds or log in to your existing profile to get started.",
      src: "/register.png",
    },
    {
      title: "Upload Your Resume",
      content:
        "Upload your resume so the system can analyze your skills and tailor the interview experience to your profile.",
      src: "/upload-resume.png",
    },
    {
      title: "Start the Interview",
      content:
        "Begin an AI-powered interview designed to simulate real-world scenarios, improve your responses, and boost your confidence.",
      src: "/practice.png",
    },
    {
      title: "Track Progress",
      content:
        "Review detailed performance reports, identify strengths and weaknesses, and monitor your improvement over time.",
      src: "/track.png",
    },
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
          <Carousel
            items={steps.map((step, index) => (
              <Card key={index} index={index} card={step} layout />
            ))}
          />
        </ScrollReveal>
      </div>
    </SectionExpand>
  );
}
