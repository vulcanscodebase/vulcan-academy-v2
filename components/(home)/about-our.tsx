import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import vulacan from "../public/about.jpg"
import Link from "next/link";

export function AboutOurSection() {
  return (
    <section className="w-full py-16 md:py-28 lg:py-40 bg-background">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 px-4 md:px-12">
        
        {/* Left side - heading and text */}
        <div className="w-full lg:w-1/2 text-left">
          <h2 className="mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance">
            About Our <br /> Vulcan Academy
          </h2>
          <p className="mb-8 text-base sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
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
        </div>

   {/* Right side - image */}
<div className="w-full lg:w-1/2 flex justify-center lg:justify-end px-1 sm:px-2 md:px-0">
  <img
    src="/about.jpg"
    alt="About Vulcan Academy"
    className="w-full max-w-xl sm:max-w-2xl md:max-w-lg lg:max-w-lg xl:max-w-xl rounded-xl shadow-lg object-cover"
  />
</div>




      </div>
    </section>
  )
}
