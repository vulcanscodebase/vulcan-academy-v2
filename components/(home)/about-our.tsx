import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionExpand } from "@/components/ui/section-expand";

export function AboutOurSection() {
  return (
    <SectionExpand className="bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-12 max-w-7xl mx-auto">
        
        {/* Left side - heading and text */}
          <ScrollReveal direction="right" className="w-full lg:w-1/2 text-left space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance">
            About Our <br /> Vulcan Academy
          </h2>
            <p className="text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
            Vulcans Academy is dedicated to empowering individuals with skills and
            knowledge through innovative and accessible solutions.
          </p>
          <Link href="/about" prefetch={false}>
          <Button
            variant="default"
            className={cn(
              "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
              "rounded-md px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            Learn More
          </Button>
          </Link>
          </ScrollReveal>

   {/* Right side - image */}
          <ScrollReveal direction="left" delay={0.2} className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
    src="/hero-section.png"
    alt="About Vulcan Academy"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
  />
</div>
          </ScrollReveal>

        </div>
      </div>
    </SectionExpand>
  )
}
