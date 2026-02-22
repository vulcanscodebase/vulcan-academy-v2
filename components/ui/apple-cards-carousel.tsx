"use client";
import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import { ArrowLeft as IconArrowNarrowLeft, ArrowRight as IconArrowNarrowRight, X as IconX } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

// -------------------- Types --------------------
export type CardType = {
  src: string;
  title: string;
  category: string;
  content: React.ReactNode;
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
export const Card = ({ card, index, layout = false }: { card: CardType; index: number; layout?: boolean }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { onCardClose } = useContext(CarouselContext);

  useOutsideClick(containerRef, () => handleClose());

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") handleClose();
    }
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

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
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg" />
            <motion.div
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-vulcan-white p-4 md:p-10"
            >
              <button className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-vulcan-accent-blue " onClick={handleClose}>
                <IconX className="h-6 w-6  text-vulcan-white" />
              </button>
              <motion.p layoutId={layout ? `category-${card.title}` : undefined} className="text-left font-sans text-sm font-medium text-vulcan-white md:text-base">
                {card.category}
              </motion.p>
              <motion.p layoutId={layout ? `title-${card.title}` : undefined} className="text-2xl md:text-3xl font-light tracking-tight text-foreground mb-2 text-left">
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Card preview */}
      <motion.button
        layoutId={layout ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative flex min-h-[20rem] w-[14rem] sm:w-56 sm:min-h-[22rem] md:w-96 md:min-h-[40rem] flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 dark:bg-neutral-900"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/70 via-transparent to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p layoutId={layout ? `category-${card.category}` : undefined} className="text-left font-sans text-sm font-medium text-vulcan-white md:text-base">
            {card.category}
          </motion.p>
          <motion.p layoutId={layout ? `title-${card.title}` : undefined} className="text-2xl md:text-3xl font-light tracking-tight text-vulcan-white mb-2 text-left ">
            {card.title}
          </motion.p>
          {/* ADDED CONTENT */}
          <motion.p className="text-base text-vulcan-white text-left">
            {card.content}
          </motion.p>
        </div>
        <img src={card.src} alt={card.title} className="absolute inset-0 z-10 h-full w-full object-cover transition duration-300" />
      </motion.button>
    </>
  );
};
