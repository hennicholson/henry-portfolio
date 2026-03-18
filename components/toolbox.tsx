"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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

interface TracePath {
  d: string;
  length: number;
  category: string;
}

interface SolderPoint {
  x: number;
  y: number;
  category: string;
}

export function Toolbox() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const chipRefs = useRef<Map<string, HTMLDivElement[]>>(new Map());

  const [traces, setTraces] = useState<TracePath[]>([]);
  const [solderPoints, setSolderPoints] = useState<SolderPoint[]>([]);

  // Register chip refs by category
  const registerChipRef = useCallback((category: string, index: number) => {
    return (el: HTMLDivElement | null) => {
      if (el) {
        const chips = chipRefs.current.get(category) || [];
        chips[index] = el;
        chipRefs.current.set(category, chips);
      }
    };
  }, []);

  // Calculate trace paths connecting chips within each category
  const calculateTraces = useCallback(() => {
    if (!boardRef.current) return;

    const boardRect = boardRef.current.getBoundingClientRect();
    const newTraces: TracePath[] = [];
    const newSolderPoints: SolderPoint[] = [];

    chipRefs.current.forEach((chips, category) => {
      if (chips.length < 2) return;

      for (let i = 0; i < chips.length - 1; i++) {
        const currentChip = chips[i];
        const nextChip = chips[i + 1];

        if (!currentChip || !nextChip) continue;

        const currentRect = currentChip.getBoundingClientRect();
        const nextRect = nextChip.getBoundingClientRect();

        // Calculate chip centers relative to board
        const x1 = currentRect.left - boardRect.left + currentRect.width / 2;
        const y1 = currentRect.top - boardRect.top + currentRect.height / 2;
        const x2 = nextRect.left - boardRect.left + nextRect.width / 2;
        const y2 = nextRect.top - boardRect.top + nextRect.height / 2;

        // Add solder points
        newSolderPoints.push(
          { x: x1, y: y1, category },
          { x: x2, y: y2, category }
        );

        // Create curved path with slight horizontal offset for organic feel
        const midY = (y1 + y2) / 2;
        const controlOffset = 12; // Horizontal offset for curve
        const direction = i % 2 === 0 ? 1 : -1; // Alternate curve direction

        const path = `M ${x1},${y1} Q ${x1 + (controlOffset * direction)},${midY} ${x2},${y2}`;

        // Calculate path length
        const tempPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        tempPath.setAttribute("d", path);
        const length = tempPath.getTotalLength();

        newTraces.push({ d: path, length, category });
      }
    });

    setTraces(newTraces);
    setSolderPoints(newSolderPoints);
  }, []);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateTraces, 200);
    };

    window.addEventListener("resize", handleResize);

    // Initial calculation after mount
    const initialTimeout = setTimeout(calculateTraces, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
      clearTimeout(initialTimeout);
    };
  }, [calculateTraces]);

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current || traces.length === 0) return;

    const ctx = gsap.context(() => {
      // 1. Header fade up
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 82%",
          onEnter: () => {
            gsap.to(headerRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            });
          },
          once: true,
        });
      }

      // 2. Board container
      if (boardRef.current) {
        gsap.set(boardRef.current, { opacity: 0, y: 40 });
        ScrollTrigger.create({
          trigger: boardRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.to(boardRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out"
            });
          },
          once: true,
        });
      }

      // 3. Chips solder in by category
      const categoryOrder = ["Build", "AI", "Ship", "Create"];
      categoryOrder.forEach((category, catIndex) => {
        const chips = chipRefs.current.get(category);
        if (!chips) return;

        gsap.set(chips, { opacity: 0, scale: 0.7 });

        ScrollTrigger.create({
          trigger: boardRef.current,
          start: "top 80%",
          onEnter: () => {
            gsap.to(chips, {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "back.out(1.4)",
              stagger: 0.08,
              delay: catIndex * 0.25,
            });
          },
          once: true,
        });
      });

      // 4. Traces draw
      const traceElements = svgRef.current?.querySelectorAll<SVGPathElement>("[data-trace]");
      if (traceElements) {
        traceElements.forEach((el, index) => {
          const category = el.dataset.category;
          const catIndex = categoryOrder.indexOf(category || "");

          ScrollTrigger.create({
            trigger: boardRef.current,
            start: "top 75%",
            onEnter: () => {
              gsap.fromTo(el,
                { strokeDashoffset: el.getTotalLength() },
                {
                  strokeDashoffset: 0,
                  duration: 1.2,
                  ease: "power2.inOut",
                  delay: catIndex * 0.2 + 0.5,
                }
              );
            },
            once: true,
          });
        });
      }

      // 5. Solder points
      const solderElements = svgRef.current?.querySelectorAll<SVGCircleElement>("[data-solder]");
      if (solderElements) {
        gsap.set(solderElements, { opacity: 0, scale: 0 });

        ScrollTrigger.create({
          trigger: boardRef.current,
          start: "top 70%",
          onEnter: () => {
            gsap.to(solderElements, {
              opacity: 1,
              scale: 1,
              duration: 0.4,
              ease: "elastic.out(1,0.6)",
              stagger: 0.05,
              delay: 1.5,
            });
          },
          once: true,
        });
      }

      // 6. Idle pulse animation
      if (traceElements && traceElements.length > 0) {
        const pulseRandomTrace = () => {
          const randomIndex = Math.floor(Math.random() * traceElements.length);
          const trace = traceElements[randomIndex];

          gsap.to(trace, {
            stroke: "rgba(255,255,255,0.35)",
            duration: 0.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              const nextDelay = 3000 + Math.random() * 2000;
              setTimeout(pulseRandomTrace, nextDelay);
            },
          });
        };

        setTimeout(pulseRandomTrace, 4000);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [traces]);

  return (
    <section ref={sectionRef} className="relative py-14 md:py-20" data-section="stack">
      {/* Crosshatch pattern background */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="crosshatch" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 0 0 L 20 20 M 20 0 L 0 20" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crosshatch)" />
        </svg>
      </div>

      <div ref={headerRef} className="w-[90vw] max-w-5xl mx-auto px-6 mb-12 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          The Toolbox
        </h2>
        <p className="mt-3 text-white/25 text-sm md:text-base font-mono">
          Core circuit topology
        </p>
      </div>

      <div className="w-[90vw] max-w-5xl mx-auto px-6">
        <div ref={boardRef} className="relative">
          {/* SVG traces overlay */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ overflow: "visible" }}
          >
            {/* Traces */}
            {traces.map((trace, index) => (
              <path
                key={`trace-${index}`}
                data-trace
                data-category={trace.category}
                d={trace.d}
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={trace.length}
                strokeDashoffset={trace.length}
              />
            ))}

            {/* Solder points */}
            {solderPoints.map((point, index) => (
              <circle
                key={`solder-${index}`}
                data-solder
                cx={point.x}
                cy={point.y}
                r="2.5"
                fill="rgba(255,255,255,0.2)"
              />
            ))}
          </svg>

          {/* Board grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category) => (
              <div key={category.label} className="flex flex-col space-y-4">
                {/* Category label (silkscreen) */}
                <div className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/20 text-center">
                  {category.label}
                </div>

                {/* Chip stack */}
                <div className="flex flex-col space-y-2">
                  {category.tools.map((tool, index) => (
                    <div
                      key={tool.name}
                      ref={registerChipRef(category.label, index)}
                      className="relative group cursor-default transition-all duration-300"
                    >
                      {/* Chip body */}
                      <div
                        className="relative rounded-md px-3 py-2.5 border transition-all duration-300"
                        style={{
                          background: "rgba(12, 12, 20, 0.6)",
                          borderColor: "rgba(255,255,255,0.06)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                        }}
                        onMouseEnter={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1.05,
                            borderColor: "rgba(255,255,255,0.18)",
                            duration: 0.3,
                            ease: "power3.out",
                          });
                          gsap.to(e.currentTarget.querySelectorAll("[data-text]"), {
                            opacity: 0.7,
                            duration: 0.3,
                          });
                        }}
                        onMouseLeave={(e) => {
                          gsap.to(e.currentTarget, {
                            scale: 1,
                            borderColor: "rgba(255,255,255,0.06)",
                            duration: 0.3,
                            ease: "power3.out",
                          });
                          gsap.to(e.currentTarget.querySelector("[data-text='name']"), {
                            opacity: 0.4,
                            duration: 0.3,
                          });
                          gsap.to(e.currentTarget.querySelector("[data-text='note']"), {
                            opacity: 0.15,
                            duration: 0.3,
                          });
                        }}
                      >
                        {/* Pin decorations - left */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col space-y-1">
                          <div className="w-[2px] h-[3px] bg-white/10" />
                          <div className="w-[2px] h-[3px] bg-white/10" />
                          <div className="w-[2px] h-[3px] bg-white/10" />
                        </div>

                        {/* Pin decorations - right */}
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col space-y-1">
                          <div className="w-[2px] h-[3px] bg-white/10" />
                          <div className="w-[2px] h-[3px] bg-white/10" />
                          <div className="w-[2px] h-[3px] bg-white/10" />
                        </div>

                        {/* Chip text */}
                        <div className="flex flex-col items-center">
                          <span
                            data-text="name"
                            className="text-[11px] font-mono text-white/40 transition-colors duration-300"
                          >
                            {tool.name}
                          </span>
                          <span
                            data-text="note"
                            className="text-[8px] font-mono tracking-wider uppercase text-white/15 transition-colors duration-300"
                          >
                            {tool.note}
                          </span>
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
