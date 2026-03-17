"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: "Build",
    tools: ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "GSAP"],
  },
  {
    label: "AI",
    tools: ["Claude", "GPT", "Midjourney", "Runway", "ElevenLabs", "Cursor"],
  },
  {
    label: "Ship",
    tools: ["Vercel", "Netlify", "Supabase", "Whop", "GitHub", "Stripe"],
  },
  {
    label: "Create",
    tools: ["Figma", "After Effects", "Premiere Pro", "DaVinci Resolve", "Canva"],
  },
];

export function Toolbox() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 82%",
          onEnter: () => {
            gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          },
          once: true,
        });
      }

      const rows = sectionRef.current!.querySelectorAll<HTMLElement>("[data-tool-row]");
      rows.forEach((row) => {
        const pills = row.querySelectorAll<HTMLElement>("[data-tool-pill]");
        gsap.set(pills, { opacity: 0, y: 16 });
        ScrollTrigger.create({
          trigger: row,
          start: "top 85%",
          onEnter: () => {
            gsap.to(pills, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power3.out" });
          },
          once: true,
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-14 md:py-20" data-section="stack">
      <div ref={headerRef} className="w-[90vw] max-w-5xl mx-auto px-6 mb-10 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          The Toolbox
        </h2>
        <p className="mt-3 text-white/25 text-sm md:text-base">
          Technologies, platforms, and tools I use daily.
        </p>
      </div>

      <div className="w-[90vw] max-w-4xl mx-auto px-6 space-y-6">
        {categories.map((cat) => (
          <div key={cat.label} data-tool-row className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/20 w-16 shrink-0">
              {cat.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {cat.tools.map((tool) => (
                <span
                  key={tool}
                  data-tool-pill
                  className="px-3 py-1.5 rounded-lg text-[11px] font-mono text-white/30 cursor-default transform-gpu transition-all duration-300 hover:text-white/60 hover:-translate-y-0.5"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
