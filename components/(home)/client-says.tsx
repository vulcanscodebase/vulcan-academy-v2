"use client"
import { Card } from "@/components/ui/apple-cards-carousel"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { SectionExpand } from "@/components/ui/section-expand"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CarouselContext } from "@/components/ui/apple-cards-carousel"

export function ClientSays() {
  const reviews: any[] = [
    {
      category: "M S Ramaiah University of applied sciences",
      title: "Gagana Lokesh",
      src: "/gagana.jpg",
      variant: "testimonial",
      content: (
        <p>
          I used to think that the only way to prep for an interview is through the traditional offline routes until I discovered Vulcanprep. The difference between offline interviews and Vulkan is day and night because in Vulcan we can experience the real interview.
          <br /><br />
          On the Vulcan platform you are allowed to make mistakes at the same time the actual pressure of the traditional interview is mimicked which helps you grow. It also helps to understand where you&apos;re going wrong.
          <br /><br />
          On the Vulcan platform you can actually get hyper-specific and data-driven feedback from the experts who actually know the industry. So if you&apos;re still prepping for the interviews the traditional way then you are leaving your career to chance.
          <br /><br />
          So switch to Vulcan, it&apos;s a total game changer.
        </p>
      ),
    },
    {
      category: "Software Development Engineer, Zynix.al",
      title: "Tangevva R gadad",
      src: "/tangevva.jpg",
      variant: "testimonial",
      content: (
        <p>
          Vulcan Prep 360 helped me identify my weak points and turn them into strengths. The structured mock interviews and constructive feedback made a huge difference in how I present myself. I felt sharper and more confident with every session.
        </p>
      ),
    },
    {
      category: "Student, Alva's Institute of Engineering and Technology",
      title: "Henba Yumlembam",
      src: "/henba.jpg",
      variant: "testimonial",
      content: (
        <p>
          Vulcan helped me with an ATS review of my resume and then asked personalized questions tailored exactly to the job role I’m targeting. The interview simulator followed up with questions relevant to my previous answers, making the experience feel real and structured.
          <br /><br />
          The personalized feedback afterward gave me clarity, awareness, and confidence. I’d genuinely recommend it to anyone serious about cracking interviews - it prepares you for what truly lands the job: a great interview.
        </p>
      ),
    },
    {
      category: "Manager, Durvankur Holidays",
      title: "Bhavana Nadig",
      src: "/bhavana.jpg",
      variant: "testimonial",
      content: (
        <p>
          I struggle with framing the tasks i do and the work I have done. It enabled me to map out exactly how to frame my experience in a way that is professional, clear, and more aligned to the language of the field.
          <br /><br />
          Thank you Vulcan for giving me confidence and making me feel like I&apos;m well prepared!
        </p>
      ),
    },
  ]


  return (
    <SectionExpand className="relative flex w-full flex-col overflow-hidden bg-background pb-12 md:pb-20">
      <div className="w-full">
        {/* Heading */}
        <ScrollReveal>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-12 md:mb-16 md:mx-24">
            What Our Users Say
          </h2>
        </ScrollReveal>

        {/* Carousel Section */}
        <ScrollReveal delay={0.2}>
          <div className="w-full px-4 md:px-24 relative overflow-visible">
            <CarouselContext.Provider value={{ onCardClose: () => { }, currentIndex: 0 }}>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4 flex">
                  {reviews.map((card, index) => (
                    <CarouselItem key={card.title} className="pl-4 basis-full md:basis-1/3 flex-shrink-0">
                      <div className="h-full w-full">
                        <Card card={card} index={index} layout={true} className="md:w-full" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-8 md:mt-12">
                  <CarouselPrevious className="static translate-y-0 bg-vulcan-accent-blue text-white hover:bg-vulcan-accent-blue/90 border-none h-10 w-10 disabled:opacity-100" disabled={false} />
                  <CarouselNext className="static translate-y-0 bg-vulcan-accent-blue text-white hover:bg-vulcan-accent-blue/90 border-none h-10 w-10 disabled:opacity-100" disabled={false} />
                </div>
              </Carousel>
            </CarouselContext.Provider>
          </div>
        </ScrollReveal>

        {/* Gradient Fades on Edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background z-10"></div>
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
