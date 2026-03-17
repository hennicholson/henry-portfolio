"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: "Build",
    description: "Core stack",
    tools: [
      { name: "React", note: "UI" },
      { name: "Next.js", note: "Framework" },
      { name: "TypeScript", note: "Language" },
      { name: "Node.js", note: "Runtime" },
      { name: "Tailwind", note: "Styling" },
      { name: "GSAP", note: "Animation" },
    ],
  },
  {
    label: "AI",
    description: "Intelligence layer",
    tools: [
      { name: "Claude", note: "Reasoning" },
      { name: "GPT", note: "Generation" },
      { name: "Midjourney", note: "Imagery" },
      { name: "Runway", note: "Video" },
      { name: "ElevenLabs", note: "Voice" },
      { name: "Cursor", note: "Code" },
    ],
  },
  {
    label: "Ship",
    description: "Deploy & monetize",
    tools: [
      { name: "Vercel", note: "Hosting" },
      { name: "Netlify", note: "Edge" },
      { name: "Supabase", note: "Database" },
      { name: "Whop", note: "Payments" },
      { name: "GitHub", note: "Source" },
      { name: "Stripe", note: "Billing" },
    ],
  },
  {
    label: "Create",
    description: "Visual production",
    tools: [
      { name: "Figma", note: "Design" },
      { name: "After Effects", note: "Motion" },
      { name: "Premiere", note: "Edit" },
      { name: "DaVinci", note: "Grade" },
      { name: "Canva", note: "Quick" },
    ],
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

      const cards = sectionRef.current!.querySelectorAll<HTMLElement>("[data-tool-card]");
      gsap.set(cards, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: cards[0],
        start: "top 85%",
        onEnter: () => {
          gsap.to(cards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" });
        },
        once: true,
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

      <div className="w-[90vw] max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat) => (
          <div
            key={cat.label}
            data-tool-card
            className="group rounded-xl p-5 md:p-6 transition-all duration-400"
            style={{
              background: "linear-gradient(180deg, rgba(12, 12, 20, 0.5) 0%, rgba(8, 8, 14, 0.7) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
            }}
          >
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/60 tracking-tight">
                {cat.label}
              </h3>
              <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/15">
                {cat.description}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {cat.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="flex flex-col items-center py-2.5 px-1 rounded-lg cursor-default transform-gpu transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.02)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                  }}
                >
                  <span className="text-[11px] font-mono text-white/40 group-hover:text-white/50 transition-colors">
                    {tool.name}
                  </span>
                  <span className="text-[8px] font-mono tracking-wider uppercase text-white/15 mt-0.5">
                    {tool.note}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
