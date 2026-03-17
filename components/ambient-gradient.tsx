"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function AmbientGradient() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      backgroundPosition: "100% 100%",
      duration: 30,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });
  }, []);
  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 20%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)
        `,
        backgroundPosition: "0% 0%",
        backgroundSize: "200% 200%",
      }}
    />
  );
}
