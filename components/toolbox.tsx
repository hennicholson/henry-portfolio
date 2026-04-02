"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ToolData {
  name: string;
  note: string;
  logoUrl?: string | null;
}

interface CategoryData {
  label: string;
  tools: ToolData[];
}

const fallbackCategories: CategoryData[] = [
  {
    label: "AI",
    tools: [
      { name: "Claude", note: "Reasoning", logoUrl: "/logos/claude.svg" },
      { name: "GPT", note: "Generation", logoUrl: "/logos/gpt.svg" },
      { name: "Gemini", note: "Multimodal", logoUrl: "/logos/gemini.svg" },
      { name: "Kling", note: "Video", logoUrl: "/logos/kling.svg" },
      { name: "Seedance", note: "Video", logoUrl: "/logos/seedance.svg" },
      { name: "Runway", note: "Video", logoUrl: "/logos/runway.svg" },
    ],
  },
  {
    label: "Build",
    tools: [
      { name: "React", note: "UI", logoUrl: "/logos/react.svg" },
      { name: "Next.js", note: "Framework", logoUrl: "/logos/nextjs.svg" },
      { name: "TypeScript", note: "Language", logoUrl: "/logos/typescript.svg" },
      { name: "Node.js", note: "Runtime", logoUrl: "/logos/nodejs.svg" },
      { name: "Tailwind", note: "Styling", logoUrl: "/logos/tailwind.svg" },
      { name: "GSAP", note: "Animation", logoUrl: "/logos/gsap.svg" },
    ],
  },
  {
    label: "Ship",
    tools: [
      { name: "Vercel", note: "Hosting", logoUrl: "/logos/vercel.svg" },
      { name: "Netlify", note: "Edge", logoUrl: "/logos/netlify.svg" },
      { name: "Supabase", note: "Database", logoUrl: "/logos/supabase.svg" },
      { name: "Neon", note: "Database", logoUrl: "/logos/neon.svg" },
      { name: "Whop", note: "Payments", logoUrl: "/logos/whop.svg" },
      { name: "GitHub", note: "Source", logoUrl: "/logos/github.svg" },
    ],
  },
  {
    label: "Create",
    tools: [
      { name: "Photoshop", note: "Design", logoUrl: "/logos/photoshop.svg" },
      { name: "Figma", note: "Design", logoUrl: "/logos/figma.svg" },
      { name: "Remotion", note: "Motion Graphics", logoUrl: "/logos/remotion.svg" },
      { name: "CapCut", note: "Edit", logoUrl: "/logos/capcut.svg" },
      { name: "CapCut Studio", note: "Studio", logoUrl: "/logos/capcut.svg" },
      { name: "Canva", note: "Quick", logoUrl: "/logos/canva.svg" },
    ],
  },
];

function ToolChip({ tool }: { tool: ToolData }) {
  return (
    <div className="group/chip relative cursor-default">
      <div
        className="relative rounded-lg px-3 py-2.5 transition-all duration-300 group-hover/chip:scale-[1.03] group-hover/chip:translate-y-[-1px]"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.4), 0 0 20px rgba(74,222,128,0.06), inset 0 1px 0 rgba(255,255,255,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
          e.currentTarget.style.boxShadow =
            "0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)";
        }}
      >
        <div className="flex items-center gap-2.5">
          {tool.logoUrl && (
            <Image
              src={tool.logoUrl}
              alt={tool.name}
              width={18}
              height={18}
              className="opacity-25 group-hover/chip:opacity-55 transition-opacity duration-300 shrink-0"
            />
          )}
          <div className="min-w-0">
            <div className="text-[12px] font-mono text-white/50 group-hover/chip:text-white/75 transition-colors duration-300 leading-tight">
              {tool.name}
            </div>
            <div className="text-[8px] font-mono tracking-[0.15em] uppercase text-white/15 group-hover/chip:text-white/30 transition-colors duration-300 leading-tight">
              {tool.note}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Drawer({
  category,
  index,
  isOpen,
  onToggle,
}: {
  category: CategoryData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={drawerRef}
      data-drawer
      className="relative"
    >
      {/* Drawer handle / label bar */}
      <div
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(); }}
        data-magnetic
        className="w-full group relative cursor-pointer select-none"
      >
        <div
          className="relative flex items-center justify-between px-5 py-3 transition-all duration-300"
          style={{
            borderRadius: isOpen ? "8px 8px 0 0" : "8px",
            background: isOpen
              ? "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderBottom: isOpen ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: isOpen
              ? "0 -2px 10px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)"
              : "0 -1px 4px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
          onMouseEnter={(e) => {
            if (!isOpen) e.currentTarget.style.background = "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 100%)";
          }}
          onMouseLeave={(e) => {
            if (!isOpen) e.currentTarget.style.background = "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)";
          }}
        >
          {/* Drawer label */}
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-mono tracking-[0.3em] uppercase transition-colors duration-300"
              style={{
                color: isOpen ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)",
              }}
            >
              {category.label}
            </span>
            <span className="text-[9px] font-mono text-white/10 tabular-nums">
              {category.tools.length}
            </span>
          </div>

          {/* Drawer handle detail */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-[3px] rounded-full transition-all duration-300"
              style={{
                background: isOpen
                  ? "rgba(74,222,128,0.25)"
                  : "rgba(255,255,255,0.08)",
              }}
            />
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              className="transition-transform duration-300"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                color: isOpen ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.15)",
              }}
            >
              <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
          </div>

          {/* Side screws */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0.5px 1px rgba(0,0,0,0.4)" }} />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", boxShadow: "inset 0 0.5px 1px rgba(0,0,0,0.4)" }} />
        </div>
      </div>

      {/* Drawer content — the tray that slides out */}
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, opacity: 0 }}
      >
        <div
          className="px-4 pt-3 pb-4 rounded-b-lg"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(8,8,14,0.95) 100%)",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "inset 0 4px 12px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Inner tray felt texture */}
          <div className="relative">
            {/* Tool grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {category.tools.map((tool, toolIdx) => (
                <div
                  key={tool.name}
                  data-tool-item
                  style={{ opacity: 0, transform: "translateY(8px)" }}
                >
                  <ToolChip tool={tool} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Toolbox({ categories }: { categories?: CategoryData[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const data = categories || fallbackCategories;
  const [openDrawers, setOpenDrawers] = useState<Set<number>>(new Set());

  const toggleDrawer = (index: number) => {
    setOpenDrawers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Animate tool items when drawer opens — scatter then snap into place
  useEffect(() => {
    if (!sectionRef.current) return;
    const drawers = sectionRef.current.querySelectorAll("[data-drawer]");
    drawers.forEach((drawer, idx) => {
      if (openDrawers.has(idx)) {
        const items = drawer.querySelectorAll<HTMLElement>("[data-tool-item]");
        items.forEach((item, itemIdx) => {
          // Seed scatter positions deterministically per item index
          const seed = idx * 10 + itemIdx;
          const scatterX = ((seed * 7 + 3) % 31 - 15);    // -15 to +15
          const scatterY = ((seed * 13 + 5) % 21 - 10);   // -10 to +10
          const scatterRot = ((seed * 11 + 7) % 17 - 8);  // -8 to +8

          // Set scattered initial state
          gsap.set(item, {
            x: scatterX,
            y: scatterY,
            rotation: scatterRot,
            opacity: 0,
            scale: 0.7,
          });

          // Snap into place with elastic ease
          gsap.to(item, {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: itemIdx * 0.04,
            ease: "elastic.out(1, 0.5)",
          });
        });
      }
    });
  }, [openDrawers]);

  // Scroll-triggered entrance
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-tb-header]", {
        scrollTrigger: { trigger: "[data-tb-header]", start: "top 85%", once: true },
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from("[data-tb-box]", {
        scrollTrigger: { trigger: "[data-tb-box]", start: "top 85%", once: true },
        opacity: 0,
        y: 40,
        rotateX: -5,
        duration: 0.9,
        ease: "power3.out",
        onComplete: () => {
          setOpenDrawers(new Set([0]));
        },
      });

      // Post-it note
      const note = sectionRef.current!.querySelector("[data-tb-note]");
      if (note) {
        gsap.set(note, { opacity: 0, x: 50, rotation: 8, scale: 0.8 });
        ScrollTrigger.create({
          trigger: note,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(note, {
              opacity: 1, x: 0, rotation: 3, scale: 1,
              duration: 0.7, ease: "back.out(1.6)", delay: 0.5,
            });
            gsap.to(note, {
              opacity: 0, x: 30, rotation: 6, scale: 0.9,
              duration: 0.5, ease: "power2.in", delay: 6.5,
            });
          },
        });
      }

      // Stagger drawer entrances
      const drawers = sectionRef.current!.querySelectorAll("[data-drawer]");
      drawers.forEach((drawer, idx) => {
        gsap.from(drawer, {
          scrollTrigger: { trigger: drawer, start: "top 90%", once: true },
          opacity: 0,
          x: idx % 2 === 0 ? -20 : 20,
          duration: 0.5,
          delay: idx * 0.08,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  // Subtle 3D tilt on mouse move
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 3;
      const rotateX = ((e.clientY - centerY) / rect.height) * -2;

      gsap.to(box, {
        rotateX,
        rotateY,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(box, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    };

    box.addEventListener("mousemove", handleMouseMove);
    box.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      box.removeEventListener("mousemove", handleMouseMove);
      box.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24" data-section="stack">
      {/* Section header */}
      <div data-tb-header className="w-[90vw] max-w-3xl mx-auto px-6 mb-10 text-center relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          The Toolbox
        </h2>
        <p className="mt-3 text-white/20 text-sm md:text-base font-mono tracking-wide">
          Open the drawers
        </p>

        {/* Post-it note */}
        <div
          data-tb-note
          className="hidden lg:block absolute -right-4 xl:right-0 top-0 pointer-events-none select-none"
          style={{ opacity: 0 }}
        >
          <div
            className="relative px-4 py-3 rounded-sm"
            style={{
              background: "rgba(255, 235, 120, 0.08)",
              border: "1px solid rgba(255, 235, 120, 0.12)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,235,120,0.05) inset",
              transform: "rotate(3deg)",
              maxWidth: "160px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-caveat), cursive",
                color: "rgba(255, 235, 120, 0.55)",
                fontSize: "16px",
                lineHeight: "1.4",
              }}
            >
              I love claude :)
            </p>
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.5 rounded-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            />
          </div>
        </div>
      </div>

      {/* 3D Toolbox */}
      <div className="w-[90vw] max-w-3xl mx-auto px-6" style={{ perspective: "1200px" }}>
        <div
          ref={boxRef}
          data-tb-box
          className="relative rounded-2xl overflow-hidden"
          style={{
            transformStyle: "preserve-3d",
            background: "linear-gradient(180deg, rgba(18,18,28,0.95) 0%, rgba(8,8,14,0.98) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: `
              0 20px 60px rgba(0,0,0,0.5),
              0 0 0 1px rgba(255,255,255,0.03) inset,
              0 2px 0 rgba(255,255,255,0.04) inset
            `,
          }}
        >
          {/* Toolbox lid / top panel */}
          <div
            className="relative px-6 py-4 flex items-center justify-between"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* Latch detail */}
              <div
                className="w-6 h-3 rounded-sm"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                }}
              />
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/15 select-none">
                HN-TOOLKIT-2026
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Status dots */}
              <div className="w-1.5 h-1.5 rounded-full bg-green-400/30" style={{ boxShadow: "0 0 4px rgba(74,222,128,0.3)" }} />
              <span className="text-[8px] font-mono text-white/10 tabular-nums">
                {data.reduce((sum, cat) => sum + cat.tools.length, 0)} TOOLS
              </span>
            </div>
          </div>

          {/* Corner bolts */}
          {[
            "top-1.5 left-1.5",
            "top-1.5 right-1.5",
            "bottom-1.5 left-1.5",
            "bottom-1.5 right-1.5",
          ].map((pos) => (
            <div
              key={pos}
              className={`absolute ${pos} w-2 h-2 rounded-full pointer-events-none`}
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.02) 70%)",
                boxShadow: "inset 0 0.5px 1px rgba(0,0,0,0.5)",
              }}
            />
          ))}

          {/* Drawers */}
          <div className="p-3 space-y-1">
            {data.map((category, index) => (
              <Drawer
                key={category.label}
                category={category}
                index={index}
                isOpen={openDrawers.has(index)}
                onToggle={() => toggleDrawer(index)}
              />
            ))}
          </div>

          {/* Bottom edge shadow for depth */}
          <div
            className="h-3"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
