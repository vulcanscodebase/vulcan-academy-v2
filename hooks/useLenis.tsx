"use client";
import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

export const useLenis =() => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,   // scroll speed
     
      lerp: 0.1,       // easing
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
