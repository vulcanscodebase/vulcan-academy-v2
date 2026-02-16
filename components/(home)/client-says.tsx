import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { SectionExpand } from "@/components/ui/section-expand"

type Review = {
  name: string
  username: string
  body: string
  img: string
}

const reviews: Review[] = [
  {
    name: "Vedanth",
    username: "VEDANTH",
    body: "Vulcan Prep 360 has transformed my interview preparation. The realistic mock interviews and detailed feedback helped me land my dream job!",
    img: "/placeholder-user.jpg", // using existing placeholder image
  },
  {
    name: "Sumanth",
    username: "SUMANTH",
    body: "The platform is incredibly intuitive and the practice sessions are so realistic. I felt completely prepared and confident going into my interviews.",
    img: "/placeholder-user.jpg", // using existing placeholder image
  },
  {
    name: "Bhavana",
    username: "BHAVANA",
    body: "The expert-guided sessions and real-time feedback were game-changers. I improved my interview skills significantly and got multiple job offers!",
    img: "/placeholder-user.jpg", // using existing placeholder image
  },
]

// Display all 3 reviews in a single row or adjust layout as needed
const firstRow = reviews
const secondRow: Review[] = [] // Empty since we only have 3 reviews

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string
  name: string
  username: string
  body: string
}) => {
  return (
    <figure
      className={cn(
        "relative h-64 w-80 cursor-pointer overflow-hidden rounded-3xl border p-6 md:p-7 shadow-xl transition-all duration-300",
        "border-vulcan-accent-blue/20 bg-gradient-to-br from-white to-vulcan-accent-blue/5",
        "hover:shadow-2xl hover:scale-[1.02] hover:border-vulcan-accent-blue/30",
        "backdrop-blur-sm"
      )}
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-vulcan-accent-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      {/* Top Section */}
      <div className="relative flex items-center gap-4 mb-4">
        <div className="relative">
          <img
            className="rounded-full border-2 border-vulcan-accent-blue/30 shadow-md"
            width="48"
            height="48"
            alt={name}
            src={img}
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-vulcan-accent-blue rounded-full border-2 border-white"></div>
        </div>
        <div className="flex flex-col">
          <figcaption className="text-base md:text-lg font-semibold text-foreground">
            {name}
          </figcaption>
          <p className="text-xs md:text-sm font-normal text-vulcan-accent-blue/70">{username}</p>
        </div>
      </div>

      {/* Review Text */}
      <blockquote className="relative text-sm md:text-base leading-relaxed text-foreground/90 font-light">
        {body}
      </blockquote>
      
      {/* Quote icon decoration */}
      <div className="absolute bottom-4 right-4 text-vulcan-accent-blue/20">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
        </svg>
      </div>
    </figure>
  )
}

export function ClientSays() {
  return (
    <SectionExpand className="relative flex w-full flex-col overflow-hidden bg-background">
      <div className="w-full">
        {/* Heading */}
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-12 md:mb-16 md:mx-24">
            What Our Users Say
          </h2>
        </ScrollReveal>

      {/* Marquee Rows */}
      <ScrollReveal delay={0.2}>
        <div className="w-full">
        <Marquee pauseOnHover className="[--duration:60s] gap-8">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        {secondRow.length > 0 && (
          <Marquee reverse pauseOnHover className="[--duration:60s] gap-8 -mt-6">
            {secondRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
        )}
        </div>
      </ScrollReveal>

        {/* Gradient Fades on Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background"></div>
      </div>

      {/* Incubated At Section */}
      <div className="w-full mt-20 md:mt-32">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-foreground mb-4">
              Incubated At:
            </h3>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={0.2}>
           <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-4">
             <div className="w-64 h-48 md:w-80 md:h-64 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
               <img
                 src="/incubated-left.jpeg"
                 alt="Incubated at left partner"
                 className="w-full h-full object-cover object-center"
               />
             </div>
             <div className="w-64 h-48 md:w-80 md:h-64 overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
               <img
                 src="/incubated-right.png"
                 alt="Incubated at right partner"
                 className="w-full h-full object-cover object-center"
               />
             </div>
           </div>
         </ScrollReveal>
      </div>
    </SectionExpand>
  )
}
