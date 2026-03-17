"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const row1 = [
  "REACT", "NEXT.JS", "AI", "WHOP", "SaaS", "SHIPPED 6 PRODUCTS", "SAN DIEGO", "TYPESCRIPT",
  "BUILDER", "ENTREPRENEUR", "CLAUDE", "FULL-STACK", "MARKETING", "DESIGN",
];

const row2 = [
  "NEWSLETTERS", "VIDEO PRODUCTION", "GSAP", "SINCE AGE 13", "FIGMA", "NODE.JS",
  "SUPABASE", "TAILWIND", "VERCEL", "MIDJOURNEY", "AFTER EFFECTS", "WHOP APPS",
];

function MarqueeRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden group">
      <div
        className="flex whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-${direction} ${items.length * 3}s linear infinite`,
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/[0.09] group-hover:text-white/25 transition-colors duration-700 px-4">
              {item}
            </span>
            <span className="text-white/[0.06] text-[8px] select-none">&middot;</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SkillsMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.set(sectionRef.current!, { opacity: 0 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 90%",
        onEnter: () => {
          gsap.to(sectionRef.current!, { opacity: 1, duration: 1.2, ease: "power2.out" });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div ref={sectionRef} className="py-5 md:py-6 overflow-hidden select-none">
        <div className="flex flex-col gap-2">
          <MarqueeRow items={row1} direction="left" />
          <MarqueeRow items={row2} direction="right" />
        </div>
      </div>
    </>
  );
}
