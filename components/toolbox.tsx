"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: "Build",
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

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Header
      gsap.from("[data-pcb-header]", {
        scrollTrigger: { trigger: "[data-pcb-header]", start: "top 85%", once: true },
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
      });

      // Board
      gsap.from("[data-pcb-board]", {
        scrollTrigger: { trigger: "[data-pcb-board]", start: "top 85%", once: true },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      });

      // Chips per column
      const columns = sectionRef.current!.querySelectorAll("[data-pcb-col]");
      columns.forEach((col, colIdx) => {
        const chips = col.querySelectorAll("[data-pcb-chip]");
        chips.forEach((chip, chipIdx) => {
          gsap.from(chip, {
            scrollTrigger: { trigger: col, start: "top 82%", once: true },
            opacity: 0,
            scale: 0.85,
            duration: 0.4,
            delay: colIdx * 0.1 + chipIdx * 0.04,
            ease: "back.out(1.4)",
          });
        });

        const traces = col.querySelectorAll("[data-pcb-trace]");
        traces.forEach((trace, traceIdx) => {
          gsap.from(trace, {
            scrollTrigger: { trigger: col, start: "top 80%", once: true },
            scaleY: 0,
            opacity: 0,
            duration: 0.3,
            delay: colIdx * 0.1 + traceIdx * 0.04 + 0.15,
            ease: "power2.out",
          });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-14 md:py-20" data-section="stack">
      {/* Section header */}
      <div data-pcb-header className="w-[90vw] max-w-5xl mx-auto px-6 mb-8 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          The Toolbox
        </h2>
        <p className="mt-3 text-white/25 text-sm md:text-base font-mono tracking-wide">
          Core circuit topology
        </p>
      </div>

      {/* PCB Board */}
      <div className="w-[90vw] max-w-5xl mx-auto px-6">
        <div
          data-pcb-board
          className="relative rounded-xl p-5 md:p-8 overflow-hidden"
          style={{
            background: "rgba(8, 8, 14, 0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Grid texture */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 19px, white 19px, white 20px),
                repeating-linear-gradient(90deg, transparent, transparent 19px, white 19px, white 20px)
              `,
            }}
          />

          {/* Board identifier */}
          <div className="absolute top-3 right-4 text-[8px] font-mono text-white/10 tracking-wider select-none">
            HN-PCB-2026 REV 1.0
          </div>

          {/* Category columns */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <div key={category.label} data-pcb-col>
                {/* Silkscreen label */}
                <div className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/30 mb-3 text-center select-none">
                  {category.label}
                </div>

                {/* Chips + traces */}
                <div className="flex flex-col items-center">
                  {category.tools.map((tool, index) => (
                    <div key={tool.name} className="w-full flex flex-col items-center">
                      {/* Trace between chips */}
                      {index > 0 && (
                        <div data-pcb-trace className="flex flex-col items-center origin-top">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.18)" }}
                          />
                          <div
                            className="w-px h-2.5"
                            style={{ background: "rgba(255,255,255,0.12)" }}
                          />
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "rgba(255,255,255,0.18)" }}
                          />
                        </div>
                      )}

                      {/* Chip */}
                      <div data-pcb-chip className="relative w-full max-w-[140px] group cursor-default">
                        <div
                          className="relative rounded px-3 py-2 transition-all duration-300 group-hover:scale-[1.04]"
                          style={{
                            background: "rgba(14, 14, 22, 0.9)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                          }}
                        >
                          {/* Left pins */}
                          <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
                            <div className="w-[3px] h-[2px] rounded-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
                            <div className="w-[3px] h-[2px] rounded-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
                            <div className="w-[3px] h-[2px] rounded-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
                          </div>

                          {/* Right pins */}
                          <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 flex flex-col gap-[3px]">
                            <div className="w-[3px] h-[2px] rounded-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
                            <div className="w-[3px] h-[2px] rounded-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
                            <div className="w-[3px] h-[2px] rounded-[1px]" style={{ background: "rgba(255,255,255,0.12)" }} />
                          </div>

                          {/* Chip content */}
                          <div className="flex flex-col items-center py-0.5">
                            <span className="text-[11px] font-mono text-white/55 group-hover:text-white/80 transition-colors duration-300">
                              {tool.name}
                            </span>
                            <span className="text-[8px] font-mono tracking-widest uppercase text-white/20 group-hover:text-white/35 transition-colors duration-300">
                              {tool.note}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
