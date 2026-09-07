"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundEngine } from "@/lib/sounds";

gsap.registerPlugin(ScrollTrigger);

const row1 = [
  "REACT", "NEXT.JS", "AI", "WHOP", "SaaS", "SHIPPED 6 PRODUCTS", "SAN DIEGO", "TYPESCRIPT",
  "BUILDER", "ENTREPRENEUR", "CLAUDE", "FULL-STACK", "MARKETING", "DESIGN",
];

const row2 = [
  "NEWSLETTERS", "VIDEO PRODUCTION", "GSAP", "SINCE AGE 13", "FIGMA", "NODE.JS",
  "SUPABASE", "TAILWIND", "VERCEL", "MIDJOURNEY", "AFTER EFFECTS", "WHOP APPS",
];

/* Crawl speed in CSS px per second. Held constant no matter how many item
   sets a row needs, so a wide viewport doesn't get a faster marquee. */
const MARQUEE_SPEED = 28;

function MarqueeRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const clipRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);

  /* The track holds two identical copies and the keyframes slide it by
     exactly one copy (-50% of its own width) for a seamless loop. Two things
     have to hold for that to work, and neither did before:
       1. The track must be sized to its content (w-max). As a block-level
          flex container it was viewport-wide, so -50% was half the viewport
          rather than one copy, and every cycle jumped.
       2. One copy must be at least as wide as the clip box, or the far end of
          the second copy comes into view and leaves a blank gap on the right.
          A copy is `sets` repetitions of the item list; the SSR default of 2
          covers viewports up to ~2x one set, and the effect below re-measures
          and grows it on wider screens. */
  const [sets, setSets] = useState(2);
  const [duration, setDuration] = useState((items.length * 3 * 2));

  useEffect(() => {
    const clip = clipRef.current;
    const set = setRef.current;
    if (!clip || !set) return;

    const measure = () => {
      const setWidth = set.offsetWidth;
      const clipWidth = clip.offsetWidth;
      if (!setWidth || !clipWidth) return;
      const needed = Math.max(1, Math.ceil(clipWidth / setWidth));
      setSets(needed);
      setDuration((setWidth * needed) / MARQUEE_SPEED);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(clip);
    return () => ro.disconnect();
  }, []);

  const renderCopy = (copyIndex: number) =>
    Array.from({ length: sets }, (_, s) => (
      <div
        key={`${copyIndex}-${s}`}
        ref={copyIndex === 0 && s === 0 ? setRef : undefined}
        className="flex shrink-0"
        aria-hidden={copyIndex === 1 || s > 0 ? true : undefined}
      >
        {items.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="mq-item text-[10px] font-mono tracking-[0.3em] uppercase px-4 transition-opacity duration-700 group-hover:opacity-80">
              {item}
            </span>
            <span className="text-white/[0.06] text-[8px] select-none">&middot;</span>
          </span>
        ))}
      </div>
    ));

  return (
    <div ref={clipRef} className="overflow-hidden group">
      {/* One chrome sweep on the row, clipped to all its text at once. This
          used to run a separate background-position animation on every span —
          ~60 concurrent paint-property animations for one visual effect. */}
      <div
        className="mq-chrome flex w-max whitespace-nowrap group-hover:[animation-play-state:paused]"
        style={{
          animation: `marquee-${direction} ${duration}s linear infinite, mq-sweep 6s ease-in-out infinite`,
        }}
      >
        {renderCopy(0)}
        {renderCopy(1)}
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
          soundEngine.playThrottled("shimmer", 1000);
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
        /* The sweep is sized in viewport units, not % of the track. The track
           is now content-width (several viewports wide), and a %-sized
           gradient on it would stretch the band out to match. */
        @keyframes mq-sweep {
          0% {
            background-position: 200vw center;
          }
          100% {
            background-position: -200vw center;
          }
        }
        @keyframes chrome-sweep {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        .mq-chrome {
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
          background-size: 200vw 100%;
          background-clip: text;
          -webkit-background-clip: text;
        }
        .mq-item {
          -webkit-text-fill-color: transparent;
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
