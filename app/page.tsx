import { Navbar } from "@/components/(layout-wrapper)/navbar";
import { Footer } from "@/components/(layout-wrapper)/footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full bg-background text-foreground">
      <main className="min-h-screen flex flex-col">
        <Navbar />
        
        {/* Interview Master Hero Section */}
        <section className="relative flex-1 w-full py-16 md:py-24 lg:py-32 overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30 dark:to-muted/10" />
          
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-vulcan-accent-blue/5 dark:bg-vulcan-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-vulcan-accent-blue/5 dark:bg-vulcan-accent-blue/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-8 z-10">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vulcan-accent-blue/10 border border-vulcan-accent-blue/20">
                    <Sparkles className="h-4 w-4 text-vulcan-accent-blue" />
                    <span className="text-sm font-medium text-vulcan-accent-blue">
                      Interview Preparation Platform
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground text-balance">
                    Interview Master
                    <span className="block mt-2 text-vulcan-accent-blue">
                      Ace Your Next Interview
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="mt-6 text-lg md:text-xl text-foreground/80 text-pretty max-w-xl">
                    Ace your next interview with expert-guided practice sessions, mock interviews, 
                    and real-time feedback. Interview Master is your comprehensive platform to 
                    prepare confidently for your next career opportunity.
                  </p>

                  {/* Key Features */}
                  <div className="mt-8 space-y-4">
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4 group">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-base font-medium text-foreground/90 block mb-1">
                            Expert-Guided Practice Sessions
                          </span>
                          <span className="text-base text-foreground/80">
                            Tailored practice sessions designed for your specific industry and role
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 group">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-base font-medium text-foreground/90 block mb-1">
                            Realistic Mock Interviews
                          </span>
                          <span className="text-base text-foreground/80">
                            Practice with AI-powered mock interviews that simulate real interview scenarios
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 group">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-base font-medium text-foreground/90 block mb-1">
                            Comprehensive Course Library
                          </span>
                          <span className="text-base text-foreground/80">
                            Access a wide range of courses covering all aspects of interview preparation
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 group">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-vulcan-accent-blue group-hover:scale-110 transition-transform" />
                        </div>
                        <div>
                          <span className="text-base font-medium text-foreground/90 block mb-1">
                            Real-Time Feedback & Analytics
                          </span>
                          <span className="text-base text-foreground/80">
                            Get instant feedback on your performance and track your progress over time
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-8">
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
                </div>

                {/* Right Column - Image/Visual */}
                <div className="relative z-10">
                  <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-vulcan-accent-blue/20 to-vulcan-deep-navy/20 dark:from-vulcan-accent-blue/10 dark:to-vulcan-deep-navy/10 border border-border/50">
                    <Image
                      src="/learning.jpg"
                      alt="Interview Master"
                      fill
                      className="object-cover dark:opacity-90"
                      priority
                    />
                    {/* Overlay gradient for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 dark:from-background/80 via-transparent to-transparent" />
                    
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-vulcan-accent-blue/20 dark:bg-vulcan-accent-blue/10 rounded-bl-full blur-2xl" />
                  </div>
                  
                  {/* Floating decorative elements */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-vulcan-accent-blue/10 dark:bg-vulcan-accent-blue/20 rounded-full blur-3xl -z-10 animate-pulse" />
                  <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-vulcan-accent-blue/5 dark:bg-vulcan-accent-blue/10 rounded-full blur-3xl -z-10" />
                  
                  {/* Stats badge overlay */}
                  <div className="absolute bottom-6 left-6 bg-background/90 dark:bg-background/80 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-vulcan-accent-blue/10 dark:bg-vulcan-accent-blue/20">
                        <TrendingUp className="h-5 w-5 text-vulcan-accent-blue dark:text-vulcan-accent-blue" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground/60 dark:text-foreground/50">Success Rate</p>
                        <p className="text-xl font-bold text-foreground dark:text-foreground">95%+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}
