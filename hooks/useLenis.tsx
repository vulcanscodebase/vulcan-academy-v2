"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
<<<<<<< Updated upstream
      duration: 0.1,   // very fast scroll speed
      lerp: 0.5,       // faster easing for snapping effect
      smoothWheel: true,
      wheelMultiplier: 3, // make wheel scrolling much more aggressive
      gestureOrientation: "vertical",
    });

    // Add scroll snapping to major sections
    lenis.on('scroll', () => {
      // Optional: Add custom scroll snapping logic here
=======
      duration: 0.5,   // scroll speed
     
      lerp: 0.2,       // easing
>>>>>>> Stashed changes
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);
}

export default useLenis;
