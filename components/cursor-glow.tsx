"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || !ref.current) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, "--cx", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "--cy", { duration: 0.5, ease: "power3" });
    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{
        background: "radial-gradient(600px circle at calc(var(--cx, -100) * 1px) calc(var(--cy, -100) * 1px), rgba(59, 130, 246, 0.04), transparent 40%)",
      }}
    />
  );
}
