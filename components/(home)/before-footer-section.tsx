import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BeforeFooterSection() {
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-16 py-16">
      <section className="w-full py-20 md:py-32 lg:py-48 bg-vulcan-deep-teal dark:bg-gray-900 text-vulcan-white rounded-3xl">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight mb-6 text-balance leading-snug md:leading-tight">
            Unlock Your Potential With <br />
            Vulcan Academy
          </h2>

          <p className="text-base sm:text-sm md:text-xl lg:text-2xl mb-8 text-vulcan-white max-w-3xl mx-auto">
            Join thousands of learners and take your skills to the next level
          </p>

          {/* Buttons always side by side */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="default"
              className={cn(
                "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
                "rounded-md px-6 sm:px-8 py-3 sm:py-5 text-sm sm:text-base font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              Sign Up Now
            </Button>

            <Button
              variant="default"
              className={cn(
                "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
                "rounded-md px-6 sm:px-8 py-3 sm:py-5 text-sm sm:text-base font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              Explore Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
