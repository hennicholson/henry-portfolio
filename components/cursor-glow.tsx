"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const magneticEls = useRef<Map<Element, { xTo: gsap.QuickToFunc; yTo: gsap.QuickToFunc }>>(new Map());

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || !ref.current) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, "--cx", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "--cy", { duration: 0.5, ease: "power3" });

    // Set up magnetic elements
    const setupMagnetic = () => {
      magneticEls.current.clear();
      document.querySelectorAll("[data-magnetic]").forEach((magEl) => {
        magneticEls.current.set(magEl, {
          xTo: gsap.quickTo(magEl, "x", { duration: 0.4, ease: "power3" }),
          yTo: gsap.quickTo(magEl, "y", { duration: 0.4, ease: "power3" }),
        });
      });
    };

    // Initial setup + re-scan on DOM changes
    setupMagnetic();
    const observer = new MutationObserver(setupMagnetic);
    observer.observe(document.body, { childList: true, subtree: true });

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);

      // Magnetic proximity
      magneticEls.current.forEach((tweens, magEl) => {
        const rect = magEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 100;

        if (dist < radius) {
          const strength = (1 - dist / radius) * 4;
          tweens.xTo(dx * strength * 0.08);
          tweens.yTo(dy * strength * 0.08);
        } else {
          tweens.xTo(0);
          tweens.yTo(0);
        }
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      observer.disconnect();
      // Reset all magnetic elements
      magneticEls.current.forEach((_, magEl) => {
        gsap.set(magEl, { x: 0, y: 0 });
      });
    };
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
