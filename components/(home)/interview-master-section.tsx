import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { SectionExpand } from "@/components/ui/section-expand";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Data definition
const productData = {
  title: "Vulcan Prep 360",
  description:
    "Master interviews with ease. Ace your next interview with expert-guided practice sessions, mock interviews, and real-time feedback.",
  image: "/interview.png",
};

export function InterviewMasterSection() {
  return (
    <SectionExpand className="mb-14 md:mb-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl text-center">
        {/* 1. Centered Big Heading */}
        <ScrollReveal>
          <h2 className="mb-8 text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground text-balance">
            {productData.title}
          </h2>
        </ScrollReveal>

        {/* 2. Centered Image */}
        <ScrollReveal delay={0.2}>
          <div
            className={cn(
              "mx-auto mb-10 w-full overflow-hidden rounded-xl shadow-2xl transition-all duration-300",
              "border border-border/50"
            )}
          >
            <Image
              src={productData.image}
              alt={productData.title}
              width={1600}
              height={900}
              className="w-full h-auto"
              priority
            />
          </div>
        </ScrollReveal>

        {/* 3. Small Light Text Description */}
        <ScrollReveal delay={0.2}>
          <p className="mx-auto max-w-2xl text-base md:text-lg text-foreground/70 font-light">
            {productData.description}
          </p>
        </ScrollReveal>
      </div>
    </SectionExpand>
  );
}
