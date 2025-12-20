// import { Button } from "@/components/ui/button"
// import { cn } from "@/lib/utils"

// const infoItems = [
//   {
//     title: "IELTS Practice Test",
//     description: "Prepare for your IELTS exam with realistic mock tests.",
//     image: "/learning.jpg",
//     buttonText: "Know more",
//   },
//   {
//     title: "VEMA",
//     description: "An advanced tool to evaluate your skills with precision.",
//     image: "/airpods-pro-3.png",
//     buttonText: "Know more",
//   },
//   {
//     title: "VEMA Pro",
//     description: "Get professional-grade evaluations for advanced skills.",
//     image: "/airpods-pro-3.png",
//     buttonText: "Know more",
//   },
//   {
//     title: "Vulcans 360",
//     description: "Learn with our comprehensive pre-recorded video courses.",
//     image: "/airpods-pro-3.png",
//     buttonText: "Know more",
//   },
// ]

// export function OurProducts() {
//   return (
//     <section className="w-full py-20 md:py-32 lg:py-48 bg-background">
//       <div className="px-4 md:px-12">
//         {/* Main Heading */}
//         <h2 className="mb-12 text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground text-balance">
//           Our Products
//         </h2>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {infoItems.map((item, index) => (
//             <div
//               key={index}
//               className="relative flex h-[60vh] flex-col justify-between overflow-hidden rounded-3xl bg-card p-6 shadow-md"
//             >
//               {/* Background Image */}
//               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="absolute inset-0 z-10 h-full w-full object-cover transition duration-300"
//                 />
//               </div>

//               {/* Content */}
//               <div className="relative z-10 flex h-full flex-col justify-between">
//                 <div>
//                   <h3 className="mb-2 text-2xl md:text-3xl font-light tracking-tight text-foreground">
//                     {item.title}
//                   </h3>
//                   <p className="mb-4 text-base text-foreground/80">
//                     {item.description}
//                   </p>
//                 </div>

//                 <div className="flex justify-end">
//                   <Button
//                     variant="default"
//                     className={cn(
//                       "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
//                       "rounded-md px-8 py-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
//                     )}
//                   >
//                     {item.buttonText}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { SectionExpand } from "@/components/ui/section-expand"

export function OurProducts() {
  const item = {
    title: "Vulcan Prep 360",
    description:
      "Master interviews with ease. Ace your next interview with expert-guided practice sessions, mock interviews, and real-time feedback.",
    image: "/learning.jpg", // replace with your actual image path
    buttonText: "Know more",
  }

  return (
    <SectionExpand className="bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
        {/* Main Heading */}
          <ScrollReveal>
        <h2 className="mb-12 text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground text-balance">
          Our Product
        </h2>
          </ScrollReveal>

        {/* Single Card */}
          <ScrollReveal delay={0.2}>
            <div className="relative flex h-[60vh] min-h-[400px] flex-col justify-between overflow-hidden rounded-3xl bg-card p-6 md:p-8 lg:p-10 shadow-lg border border-border/50">
          {/* Background Image */}
            <div className="absolute inset-0">
              <Image
              src={item.image}
              alt={item.title}
                fill
                className="object-cover object-center transition duration-300"
                sizes="100vw"
                priority
            />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
                <h3 className="mb-2 text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-foreground">
                {item.title}
              </h3>
                <p className="mb-4 text-base md:text-lg text-foreground/80 max-w-2xl">
                {item.description}
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="default"
                className={cn(
                  "bg-vulcan-accent-blue text-vulcan-white hover:bg-vulcan-accent-blue/90",
                  "rounded-md px-8 py-5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                )}
              >
                {item.buttonText}
              </Button>
            </div>
          </div>
          </div>
          </ScrollReveal>
        </div>
      </div>
    </SectionExpand>
  )
}
