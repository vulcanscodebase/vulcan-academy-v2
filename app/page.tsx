import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
// import { AboutOurSection } from "@/components/(home)/about-our";
import { HowItWorks } from "@/components/(home)/how-it-works";
import { ClientSays } from "@/components/(home)/client-says";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { InterviewMasterSection } from "@/components/(home)/interview-master-section";

export default function Home() {
  return (
    <div className="w-full bg-white text-foreground">
      <main className="min-h-screen">
        <Navbar />

        {/* Vulcan Interview Master Hero Section */}
        <section className="relative flex-1 w-full h-screen flex items-center overflow-hidden bg-white pt-16 md:pt-20">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30" />

          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-vulcan-accent-blue/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-vulcan-accent-blue/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative container mx-auto px-4 md:px-6 lg:px-8 w-full py-4 md:py-6">
            <div className="max-w-7xl mx-auto w-full">
              {/* Main Content Grid */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12 w-full pb-10">
                {/* Left Column - Text Content */}
                <ScrollReveal
                  direction="right"
                  className="w-full lg:w-1/2 space-y-4 md:space-y-6 z-10"
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-vulcan-accent-blue/10 border border-vulcan-accent-blue/20">
                    <Sparkles className="h-3.5 w-3.5 text-vulcan-accent-blue" />
                    <span className="text-xs md:text-sm font-medium text-vulcan-accent-blue">
                      Interview Preparation Platform
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance">
                    Vulcan Interview Master
                    <span className="block mt-1 text-vulcan-accent-blue">
                      Master interviews with ease
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="mt-3 md:mt-4 text-base md:text-lg text-foreground/80 text-pretty max-w-xl">
                    Ace your next interview with expert-guided practice
                    sessions, mock interviews, and real-time feedback. Vulcan
                    Interview Master is your comprehensive platform to prepare
                    confidently for your next career opportunity.
                  </p>

                  {/* Key Features - Grid Layout */}
                  <div className="mt-4 md:mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div className="flex items-start gap-3 group">
                        <div className="mt-0.5 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-vulcan-accent-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground/90 block mb-0.5">
                            Realistic Mock Interviews
                          </span>
                          <span className="text-xs md:text-sm text-foreground/80">
                            AI-powered interviews with real scenarios
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 group">
                        <div className="mt-0.5 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-vulcan-accent-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground/90 block mb-0.5">
                            Detailed Assessments
                          </span>
                          <span className="text-xs md:text-sm text-foreground/80">
                            Comprehensive evaluation of your performance
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 group">
                        <div className="mt-0.5 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-vulcan-accent-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground/90 block mb-0.5">
                            Actionable Feedback
                          </span>
                          <span className="text-xs md:text-sm text-foreground/80">
                            Personalized insights to improve your skills
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 group">
                        <div className="mt-0.5 flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-vulcan-accent-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground/90 block mb-0.5">
                            ATS Based Resume Analysis
                          </span>
                          <span className="text-xs md:text-sm text-foreground/80">
                            Optimize your resume for applicant tracking systems
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-4 md:mt-6">
                    <Link href="/interview">
                      <Button
                        variant="default"
                        className={cn(
                          "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
                          "rounded-md px-8 py-5 text-sm font-medium transition-colors",
                          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                          "disabled:pointer-events-none disabled:opacity-50"
                        )}
                      >
                        Know More
                      </Button>
                    </Link>
                  </div>
                </ScrollReveal>

                {/* Right Column - Image/Visual */}
                <ScrollReveal
                  direction="left"
                  delay={0.2}
                  className="w-full lg:w-1/2 relative z-10 flex items-center justify-center lg:justify-end"
                >
                  <div className="relative w-full max-w-md lg:max-w-lg mx-auto lg:mx-0">
                    <div className="relative w-full aspect-[4/3] lg:aspect-[4/5] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-vulcan-accent-blue/20 to-vulcan-deep-navy/20 border border-border/50">
                      <Image
                        src="/interview-report.jpg"
                        alt="Vulcan Interview Master"
                        fill
                        className="object-cover object-center"
                        priority
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      {/* Overlay gradient for better text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                      {/* Decorative corner accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-vulcan-accent-blue/20 rounded-bl-full blur-2xl" />
                    </div>

                    {/* Floating decorative elements - constrained within parent */}
                    <div className="absolute top-2 right-2 w-24 h-24 bg-vulcan-accent-blue/10 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
                    <div className="absolute bottom-2 left-2 w-32 h-32 bg-vulcan-accent-blue/5 rounded-full blur-3xl -z-10 pointer-events-none" />

                    {/* Stats badge overlay */}
                    {/* <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-border/50 z-20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-vulcan-accent-blue/10">
                          <TrendingUp className="h-5 w-5 text-vulcan-accent-blue" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground/60">
                            Success Rate
                          </p>
                          <p className="text-xl font-bold text-foreground">
                            95%+
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* About Vulcan Academy Section */}
        {/* <AboutOurSection /> */}

        {/* Our Product Section */}
        <InterviewMasterSection />

        {/* How It Works Section */}
        <HowItWorks />

        {/* What Our Clients Say Section */}
        <ClientSays />

        <Footer />
      </main>
    </div>
  );
}
