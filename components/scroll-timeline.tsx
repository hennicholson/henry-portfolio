"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

/* ── Milestone data ───────────────────────────────────────────── */
const milestones = [
  {
    year: "2018",
    age: 13,
    title: "The Spark",
    description:
      "Started my first online venture, discovering the world of digital entrepreneurship at just 13 years old.",
  },
  {
    year: "2020",
    age: 15,
    title: "Learning to Code",
    description:
      "Taught myself web development and started turning ideas into real, working products.",
  },
  {
    year: "2022",
    age: 17,
    title: "First Product Launch",
    description:
      "Built and shipped my first SaaS product, learning everything from design to deployment.",
  },
  {
    year: "2024",
    age: 19,
    title: "Going Full-Time",
    description:
      "Committed fully to building products, scaling my skills and growing my ventures.",
  },
  {
    year: "2026",
    age: 21,
    title: "Building the Future",
    description:
      "Creating Launchpad and tools that empower others to bring their ideas to life.",
  },
];

/* ── Grid layout: 8 cols × 5 rows, zigzag interlocking ────────
 *
 *  Row 0:  S4 S4 S4 S4  S5 S5 S5 S5
 *  Row 1:  S4 S4 S3 S3  S3 S3 S5 S5
 *  Row 2:  S1 S3 S3 S3  S3 S2 S2 S2
 *  Row 3:  S1 S1 S1 S2  S2 S2 S2 S2
 *  Row 4:  S1 S1 S1 S1  S2 S2 S2 S2
 *
 *  S1: 8 cells  · S2: 12 cells · S3: 8 cells
 *  S4: 6 cells  · S5: 6 cells  · Total: 40
 */

const GAP = 2; // px gap between sections

const sections = [
  {
    // S1 — bottom-left L-shape (drops 1st)
    milestoneIdx: 0,
    bg: "#1a1a1a",
    left: "0%",
    top: "40%",
    width: "50%",
    height: "60%",
    clipPath: `polygon(
      ${GAP}px ${GAP}px,
      calc(25% - ${GAP / 2}px) ${GAP}px,
      calc(25% - ${GAP / 2}px) calc(33.33% - ${GAP / 2}px),
      calc(75% - ${GAP / 2}px) calc(33.33% - ${GAP / 2}px),
      calc(75% - ${GAP / 2}px) calc(66.67% - ${GAP / 2}px),
      calc(100% - ${GAP}px) calc(66.67% - ${GAP / 2}px),
      calc(100% - ${GAP}px) calc(100% - ${GAP}px),
      ${GAP}px calc(100% - ${GAP}px)
    )`,
    // Content in wide bottom area of L
    contentAlign: "start" as const,
    contentJustify: "end" as const,
    contentPad: "1.5rem 1.5rem 1.5rem 1.5rem",
  },
  {
    // S2 — bottom-right reverse-L (drops 2nd)
    milestoneIdx: 1,
    bg: "#252525",
    left: "37.5%",
    top: "40%",
    width: "62.5%",
    height: "60%",
    clipPath: `polygon(
      calc(40% + ${GAP / 2}px) ${GAP}px,
      calc(100% - ${GAP}px) ${GAP}px,
      calc(100% - ${GAP}px) calc(100% - ${GAP}px),
      calc(20% + ${GAP / 2}px) calc(100% - ${GAP}px),
      calc(20% + ${GAP / 2}px) calc(66.67% + ${GAP / 2}px),
      ${GAP}px calc(66.67% + ${GAP / 2}px),
      ${GAP}px calc(33.33% + ${GAP / 2}px),
      calc(40% + ${GAP / 2}px) calc(33.33% + ${GAP / 2}px)
    )`,
    contentAlign: "end" as const,
    contentJustify: "end" as const,
    contentPad: "1.5rem 1.5rem 1.5rem 2.5rem",
  },
  {
    // S3 — middle Z-shape (drops 3rd)
    milestoneIdx: 2,
    bg: "#1e1e1e",
    left: "12.5%",
    top: "20%",
    width: "62.5%",
    height: "40%",
    clipPath: `polygon(
      calc(20% + ${GAP / 2}px) ${GAP}px,
      calc(100% - ${GAP}px) ${GAP}px,
      calc(100% - ${GAP}px) calc(50% - ${GAP / 2}px),
      calc(80% - ${GAP / 2}px) calc(50% - ${GAP / 2}px),
      calc(80% - ${GAP / 2}px) calc(100% - ${GAP}px),
      ${GAP}px calc(100% - ${GAP}px),
      ${GAP}px calc(50% + ${GAP / 2}px),
      calc(20% + ${GAP / 2}px) calc(50% + ${GAP / 2}px)
    )`,
    contentAlign: "center" as const,
    contentJustify: "center" as const,
    contentPad: "1.5rem 2rem",
  },
  {
    // S4 — top-left reverse-L (drops 4th)
    milestoneIdx: 3,
    bg: "#212121",
    left: "0%",
    top: "0%",
    width: "50%",
    height: "40%",
    clipPath: `polygon(
      ${GAP}px ${GAP}px,
      calc(100% - ${GAP}px) ${GAP}px,
      calc(100% - ${GAP}px) calc(50% - ${GAP / 2}px),
      calc(50% + ${GAP / 2}px) calc(50% - ${GAP / 2}px),
      calc(50% + ${GAP / 2}px) calc(100% - ${GAP}px),
      ${GAP}px calc(100% - ${GAP}px)
    )`,
    contentAlign: "start" as const,
    contentJustify: "start" as const,
    contentPad: "1.5rem",
  },
  {
    // S5 — top-right L-shape (drops 5th)
    milestoneIdx: 4,
    bg: "#282828",
    left: "50%",
    top: "0%",
    width: "50%",
    height: "40%",
    clipPath: `polygon(
      ${GAP}px ${GAP}px,
      calc(100% - ${GAP}px) ${GAP}px,
      calc(100% - ${GAP}px) calc(100% - ${GAP}px),
      calc(50% - ${GAP / 2}px) calc(100% - ${GAP}px),
      calc(50% - ${GAP / 2}px) calc(50% + ${GAP / 2}px),
      ${GAP}px calc(50% + ${GAP / 2}px)
    )`,
    contentAlign: "end" as const,
    contentJustify: "start" as const,
    contentPad: "1.5rem",
  },
];

export function ScrollTimeline() {
  const wrapperRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    if (!pinRef.current || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      // Set header invisible initially, will fade in as part of timeline
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 0, y: 20 });
      }

      // Set all sections above the grid, invisible
      sectionRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { yPercent: -160, opacity: 0 });
      });

      // Build the pinned drop timeline — pins header + grid together
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          pin: true,
          start: "top 8%",
          end: "+=140%",
          scrub: 0.3,
          anticipatePin: 1,
        },
      });

      // Fade in header first
      if (headerRef.current) {
        tl.to(headerRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
        tl.to({}, { duration: 0.05 }); // brief pause
      }

      // Drop each section sequentially (bottom pieces first)
      sections.forEach((_, i) => {
        const el = sectionRefs.current[i];
        if (!el) return;

        // Drop from above → land
        tl.to(
          el,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.in",
          },
          i === 0 ? 0.02 : ">"
        );

        // Landing impact — squash → spring back
        tl.fromTo(
          el,
          { scaleY: 0.88, scaleX: 1.06 },
          {
            scaleY: 1,
            scaleX: 1,
            duration: 0.25,
            ease: "elastic.out(1.4, 0.35)",
          }
        );

        // Brief pause before next piece
        if (i < sections.length - 1) {
          tl.to({}, { duration: 0.08 });
        }
      });

      // Hold the completed grid briefly before unpinning
      tl.to({}, { duration: 0.2 });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapperRef} className="relative py-24 md:py-40">
      {/* Pinned container — header + grid stay fixed together */}
      <div ref={pinRef}>
        <div
          ref={headerRef}
          className="max-w-3xl mx-auto px-6 mb-12 md:mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            The Journey
          </h2>
          <p className="mt-4 text-white/40 text-lg">
            From curious kid to full-time builder
          </p>
        </div>

        {/* Tetris bento grid */}
        <div
          ref={gridRef}
          className="tetris-grid-container"
        >
        {sections.map((section, i) => {
          const m = milestones[section.milestoneIdx];
          return (
            <div
              key={section.milestoneIdx}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className="tetris-section"
              style={{
                position: "absolute",
                left: section.left,
                top: section.top,
                width: section.width,
                height: section.height,
                clipPath: section.clipPath,
                backgroundColor: section.bg,
                backgroundImage:
                  "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: section.contentAlign,
                justifyContent: section.contentJustify,
                padding: section.contentPad,
                transformOrigin: "center bottom",
              }}
            >
              <div className="tetris-section-content">
                <span className="inline-block text-amber-400/70 text-xs font-mono tracking-wider mb-1.5">
                  {m.year} · Age {m.age}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                  {m.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-[280px]">
                  {m.description}
                </p>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Mobile fallback — simple stacked cards */}
      <div className="tetris-mobile-fallback">
        {milestones.map((m) => (
          <div key={m.year} className="milestone-block-mobile">
            <span className="inline-block text-amber-400/70 text-xs font-mono tracking-wider mb-2">
              {m.year} · Age {m.age}
            </span>
            <h3 className="text-lg font-bold text-white mb-1">{m.title}</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              {m.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
