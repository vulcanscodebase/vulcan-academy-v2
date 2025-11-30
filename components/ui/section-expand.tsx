"use client";

import { useInView, useScroll, useTransform } from "motion/react";
import { motion } from "motion/react";
import { useRef, ReactNode } from "react";

interface SectionExpandProps {
  children: ReactNode;
  className?: string;
}

export function SectionExpand({
  children,
  className = "",
}: SectionExpandProps) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 1]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 0.8, 1],
    [0.2, 1, 1, 1]
  );
  const y = useTransform(scrollYProgress, [0, 0.5], [150, 0]);

  return (
    <motion.section
      ref={ref}
      style={{
        scale,
        opacity,
        y,
      }}
      className={`min-h-screen flex items-center justify-center w-full ${className}`}
    >
      <div className="w-full">{children}</div>
    </motion.section>
  );
}
