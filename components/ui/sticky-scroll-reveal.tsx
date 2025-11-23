"use client"
import type React from "react"
import { useRef, useState } from "react"
import { useScroll, useMotionValueEvent, motion } from "motion/react"
import { cn } from "@/lib/utils"

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string
    description: string
    content?: React.ReactNode | any
  }[]
  contentClassName?: string
}) => {
  const [activeCard, setActiveCard] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  })

  const cardLength = content.length

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Using (cardLength - 1) ensures breakpoints span the full scroll range
    const cardsBreakpoints = content.map((_, index) => (cardLength > 1 ? index / (cardLength - 1) : 0))

    const closestBreakpointIndex = cardsBreakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint)
      if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
        return index
      }
      return acc
    }, 0)
    setActiveCard(closestBreakpointIndex)
  })

  return (
    <motion.div ref={ref} className="relative flex justify-center space-x-10 rounded-3xl p-10">
      {/* Left side cards */}
      <div className="relative flex flex-col items-start md:px-12">
        {content.map((item, index) => (
          <div key={item.title + index} className="flex min-h-screen flex-col justify-center sticky">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-2"
            >
              {item.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              className="mt-6 max-w-xl text-lg font-light tracking-tight text-foreground"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>

      {/* Right side sticky */}
      <div className="hidden lg:block w-full lg:w-1/2">
        <div className="sticky top-0 h-screen flex items-center justify-center">
          <div className={cn("w-[28rem] h-[28rem] overflow-hidden rounded-2xl", contentClassName)}>
            {content[activeCard].content ?? null}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
