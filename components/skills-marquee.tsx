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
            <span
              className="marquee-chrome-text text-[10px] font-mono tracking-[0.3em] uppercase px-4 transition-all duration-700 group-hover:opacity-80"
              style={{
                animationDelay: `${(i * 0.6) % 4}s`,
              }}
            >
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
        @keyframes chrome-sweep {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .marquee-chrome-text {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.08) 0%,
            rgba(255,255,255,0.08) 35%,
            rgba(255,255,255,0.45) 48%,
            rgba(200,220,255,0.6) 50%,
            rgba(255,255,255,0.45) 52%,
            rgba(255,255,255,0.08) 65%,
            rgba(255,255,255,0.08) 100%
          );
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: chrome-sweep 4s ease-in-out infinite;
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
