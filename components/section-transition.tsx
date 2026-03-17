"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  variant?: "subtle" | "chapter";
}

export function SectionTransition({ variant = "subtle" }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.set(ref.current, { opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      onEnter: () => { gsap.to(ref.current, { opacity: 1, duration: 0.8, ease: "power2.out" }); },
      once: true,
    });
    return () => trigger.kill();
  }, []);

  if (variant === "chapter") {
    return (
      <div ref={ref} className="relative py-3 md:py-5 flex flex-col items-center gap-0">
        <div className="w-px h-5 bg-gradient-to-b from-transparent to-white/[0.08]" />
        <div className="w-1 h-1 rounded-full bg-white/15 my-1.5" />
        <div className="w-px h-5 bg-gradient-to-b from-white/[0.08] to-transparent" />
      </div>
    );
  }

  return (
    <div ref={ref} className="relative py-2 md:py-3">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}
