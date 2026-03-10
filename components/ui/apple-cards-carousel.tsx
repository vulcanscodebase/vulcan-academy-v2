"use client";
import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

// -------------------- Types --------------------
export type CardType = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
  variant?: "apple" | "testimonial";
};

interface CarouselProps {
  items: JSX.Element[];
  initialScroll?: number;
}

// -------------------- Context --------------------
export const CarouselContext = createContext<{
  onCardClose: (index: number) => void;
  currentIndex: number;
}>({
  onCardClose: () => { },
  currentIndex: 0,
});

// -------------------- Carousel --------------------
export const Carousel = ({ items, initialScroll = 0 }: CarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => carouselRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => carouselRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  const handleCardClose = (index: number) => {
    if (carouselRef.current) {
      const cardWidth = window.innerWidth < 768 ? 230 : 384; // mobile vs desktop
      const gap = window.innerWidth < 768 ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-10 lg:py-2"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div className={cn("flex flex-row justify-start gap-8 pl-4 mx-auto max-w-7xl")}>
            {items.map((item, index) => (
              <motion.div
                key={"card" + index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5 * index, ease: "easeOut" } }}
                className="rounded-md last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2 md:py-6">
          <button className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-vulcan-accent-blue hover:bg-vulcan-accent-blue/90 " onClick={scrollLeft} disabled={!canScrollLeft}>
            <IconArrowNarrowLeft className="h-6 w-6 text-vulcan-white" />
          </button>
          <button className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-vulcan-accent-blue hover:bg-vulcan-accent-blue/90 disabled:opacity-50" onClick={scrollRight} disabled={!canScrollRight}>
            <IconArrowNarrowRight className="h-6 w-6 text-vulcan-white" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

// -------------------- Card Component --------------------
export const Card = ({ card, index, layout = false, className }: { card: CardType; index: number; layout?: boolean; className?: string }) => {
  const variant = card.variant || "apple";
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useOutsideClick(containerRef, () => handleClose());

  useEffect(() => {
    setMounted(true);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && mounted && createPortal(
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-10 perspective-1000 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              className="fixed inset-0 bg-black/60 dark:bg-black/80"
              onClick={handleClose}
            />
            <motion.div
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={cn(
                "relative z-[999999] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-12 shadow-2xl",
                variant === "testimonial"
                  ? "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                  : "bg-white dark:bg-neutral-900"
              )}
            >
              <button
                className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-vulcan-accent-blue hover:scale-110 transition duration-200 shadow-lg z-[100]"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-white" />
              </button>

              <div className="flex flex-col md:flex-row gap-10">
                {variant === "testimonial" && (
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <img
                      src={card.src}
                      alt={card.title}
                      className="w-32 h-32 md:w-48 md:h-48 rounded-2xl object-cover shadow-2xl border-4 border-white dark:border-neutral-800"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <motion.p
                    layoutId={layout ? `title-${card.title}` : undefined}
                    className={cn(
                      "text-4xl md:text-6xl font-bold mb-2 text-left leading-tight",
                      variant === "testimonial" ? "text-neutral-900 dark:text-neutral-100" : "text-black dark:text-white"
                    )}
                  >
                    {card.title}
                  </motion.p>
                  <motion.p
                    layoutId={layout ? `category-${card.title}` : undefined}
                    className={cn(
                      "text-left font-sans text-2xl md:text-4xl font-semibold tracking-wide",
                      variant === "testimonial" ? "text-vulcan-accent-blue mb-8" : "text-neutral-400"
                    )}
                  >
                    {card.category}
                  </motion.p>
                  <div className="text-neutral-700 dark:text-neutral-300 text-xl md:text-3xl leading-relaxed border-l-4 border-vulcan-accent-blue/20 pl-8 my-8">
                    {card.content}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>

      {/* Card preview */}
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className={cn(
          "relative flex min-h-[20rem] w-[14rem] sm:w-56 sm:min-h-[22rem] md:w-96 md:min-h-[40rem] flex-shrink-0 flex-col items-start justify-start overflow-hidden rounded-3xl transition duration-300 hover:shadow-xl group",
          variant === "testimonial"
            ? "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-md p-8"
            : "bg-gray-100 dark:bg-neutral-900",
          className
        )}
      >
        {variant === "apple" && (
          <>
            <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/70 via-transparent to-transparent" />
            <div className="relative z-40 p-8">
              <motion.p layoutId={layout ? `category-${card.category}` : undefined} className="text-left font-sans text-sm font-medium text-white md:text-base">
                {card.category}
              </motion.p>
              <motion.p layoutId={layout ? `title-${card.title}` : undefined} className="text-2xl md:text-3xl font-semibold text-white [text-wrap:balance] font-sans mt-2 text-left">
                {card.title}
              </motion.p>
            </div>
            <img src={card.src} alt={card.title} className="absolute inset-0 z-10 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          </>
        )}

        {variant === "testimonial" && (
          <div className="relative z-40 flex flex-col h-full w-full">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <div className="text-vulcan-accent-blue text-4xl font-serif opacity-30 h-8">"</div>
                <motion.p layoutId={layout ? `title-${card.title}` : undefined} className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 text-left leading-tight">
                  {card.title}
                </motion.p>
                <motion.p layoutId={layout ? `category-${card.category}` : undefined} className="text-left font-sans text-xl md:text-2xl font-medium text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                  {card.category}
                </motion.p>
              </div>
              <img src={card.src} alt={card.title} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-md border-2 border-white dark:border-neutral-800 -mt-2 -mr-2" />
            </div>

            <div className="flex-grow overflow-hidden mt-2">
              <div className="text-neutral-800 dark:text-neutral-300 text-lg md:text-xl text-left leading-relaxed line-clamp-[8]">
                {card.content}
              </div>
            </div>

            <div className="mt-auto pt-6 flex justify-end items-center bg-transparent">
              <div className="text-vulcan-accent-blue text-4xl font-serif opacity-30 h-8 rotate-180">"</div>
            </div>
          </div>
        )}
      </motion.button>
    </>
  );
};
