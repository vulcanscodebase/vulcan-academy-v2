import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import background from "@/public/hero-section.png"

export function HeroSection() {
  return (
    <section
      className="relative w-full min-h-[calc(100vh--2rem)] pt-16 bg-center bg-cover bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url(${background.src})` }}
    >
      {/* container */}
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground text-balance">
            Welcome to Vulcan Academy <br />
            <span className="text-vulcan-accent-blue">
              Your gateway to Skill Development
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/80 text-pretty">
            Easy to use tools designed to unlock your potential.
          </p>
          <div className="mt-8">
            <Button
              variant="default"
              className={cn(
                "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
                "rounded-md px-8 py-5 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              Explore Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
