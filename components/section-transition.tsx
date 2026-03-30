"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  variant?: "subtle" | "chapter";
}

const gapMessages = [
  "still scrolling?",
  "you\u2019re thorough \u2014 I like that",
  "keep going...",
  "almost there",
  "you found a secret",
];

export function SectionTransition({ variant = "subtle" }: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const msgRef = useRef<HTMLSpanElement>(null);
  const [message, setMessage] = useState(gapMessages[0]);

  useEffect(() => {
    setMessage(gapMessages[Math.floor(Math.random() * gapMessages.length)]);
  }, []);
  const shown = useRef(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.set(ref.current, { opacity: 0 });
    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      onEnter: () => { gsap.to(ref.current, { opacity: 1, duration: 0.8, ease: "power2.out" }); },
      once: true,
    });

    // Pause detection for chapter variant
    let pauseTrigger: ScrollTrigger | undefined;
    if (variant === "chapter" && msgRef.current) {
      gsap.set(msgRef.current, { opacity: 0, y: 4 });

      pauseTrigger = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 60%",
        end: "bottom 40%",
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity());
          if (velocity < 30 && self.isActive && !shown.current) {
            // User paused — start timer
            if (!pauseTimer.current) {
              pauseTimer.current = setTimeout(() => {
                if (!msgRef.current || shown.current) return;
                shown.current = true;
                gsap.to(msgRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
                // Auto-hide after 2.5s
                setTimeout(() => {
                  if (msgRef.current) {
                    gsap.to(msgRef.current, { opacity: 0, y: -4, duration: 0.4, ease: "power2.in" });
                  }
                }, 2500);
              }, 600);
            }
          } else {
            // Scrolling — clear timer
            if (pauseTimer.current) {
              clearTimeout(pauseTimer.current);
              pauseTimer.current = null;
            }
          }
        },
      });
    }

    return () => {
      trigger.kill();
      pauseTrigger?.kill();
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, [variant]);

  if (variant === "chapter") {
    return (
      <div ref={ref} className="relative py-3 md:py-5 flex flex-col items-center gap-0">
        <div className="w-px h-5 bg-gradient-to-b from-transparent to-white/[0.08]" />
        <div className="w-1 h-1 rounded-full bg-white/15 my-1.5" />
        <div className="w-px h-5 bg-gradient-to-b from-white/[0.08] to-transparent" />
        <span
          ref={msgRef}
          className="absolute top-full mt-1 text-center select-none pointer-events-none whitespace-nowrap"
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "13px",
            color: "rgba(255,255,255,0.08)",
          }}
        >
          {message}
        </span>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative py-2 md:py-3">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}
