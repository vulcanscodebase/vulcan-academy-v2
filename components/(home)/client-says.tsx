import { cn } from "@/lib/utils"
import { Marquee } from "@/components/ui/marquee"

const reviews = [
  {
    name: "Jack",
    username: "JACK MAN",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "/images/clients/jack.jpg", // replace with real image
  },
  {
    name: "Jill",
    username: "JILLY GUY",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "/images/clients/jill.jpg",
  },
  {
    name: "John",
    username: "JOHN MINDRAA",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/images/clients/john.jpg",
  },
  {
    name: "Jane",
    username: "JANE PINKMAN",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/images/clients/jane.jpg",
  },
  {
    name: "Jenny",
    username: "JENNY WALL",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/images/clients/jenny.jpg",
  },
  {
    name: "James",
    username: "JAMES CORN",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "/images/clients/james.jpg",
  },
]

const firstRow = reviews.slice(0, reviews.length / 2)
const secondRow = reviews.slice(reviews.length / 2)

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
        "relative h-52 w-80 cursor-pointer overflow-hidden rounded-2xl border p-6 shadow-sm transition-colors",
        // light mode
        "border-foreground/10 bg-background hover:bg-foreground/5",
        // dark mode
        "dark:border-foreground/20 dark:bg-background dark:hover:bg-foreground/10"
      )}
    >
      {/* Top Section */}
      <div className="flex items-center gap-3">
        <img
          className="rounded-full border border-foreground/20"
          width="40"
          height="40"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-base font-medium text-foreground">
            {name}
          </figcaption>
          <p className="text-sm font-normal text-foreground/60">{username}</p>
        </div>
      </div>

      {/* Review Text */}
      <blockquote className="mt-4 text-sm md:text-base leading-relaxed text-foreground/90">
        {body}
      </blockquote>
    </figure>
  )
}

export function ClientSays() {
  return (
    <section className="relative flex w-full flex-col overflow-hidden bg-background py-20 md:py-32 lg:py-40">
      
      {/* Heading */}
      {/* <div className="mb-16"> */}
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-foreground mb-16 md:mx-24">
          What Our Clients Say
        </h2>
        {/* <p className="mt-4 text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
          Trusted by professionals and businesses worldwide, here’s what they have to say about working with us.
        </p>
      </div> */}

      {/* Marquee Rows */}
      <div className="w-full">
        <Marquee pauseOnHover className="[--duration:25s] gap-6">
          {firstRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:25s] gap-6 -mt-6">
          {secondRow.map((review) => (
            <ReviewCard key={review.username} {...review} />
          ))}
        </Marquee>
      </div>

      {/* Gradient Fades on Edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background"></div>
    </section>
  )
}
