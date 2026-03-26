"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    year: "2018",
    age: "13",
    title: "The Spark",
    body: "Built my first online business from a bedroom in Minnesota. No mentors, no playbook \u2014 just a kid who figured out the internet could be more than entertainment.",
    quote: "You don\u2019t need permission to start.",
    annotation: "this changed everything \u2726",
  },
  {
    year: "2020",
    age: "15",
    title: "Learning to Code",
    body: "Taught myself to code by breaking things and rebuilding them. Turned scattered ideas into working products for the first time.",
    quote: "The best way to learn is to ship.",
  },
  {
    year: "2022",
    age: "17",
    title: "First Product Launch",
    body: "Designed, built, and shipped my first SaaS product. Started experimenting with AI tools before most people knew they existed.",
    quote: "Done beats perfect. Every time.",
    annotation: "17 and shipping SaaS?!",
  },
  {
    year: "2024",
    age: "19",
    title: "Going Full-Time",
    body: "Joined Global Prairie as a Junior Associate, co-founded ForeFront USD, and launched Adventures in AI \u2014 now 53+ issues and counting.",
    quote: "Say yes, then figure it out.",
  },
  {
    year: "2026",
    age: "21",
    title: "Building the Future",
    body: "Creating LaunchPad, Skinny Studio, and Slop.design while studying marketing at the University of San Diego. Learning in public, no gatekeeping.",
    quote: "The work is never done \u2014 and that\u2019s the point.",
    annotation: "\u2190 you are here",
  },
];

export function ScrollTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const annotationRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 0, y: 30 });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 82%",
          onEnter: () => {
            gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          },
          once: true,
        });
      }

      if (lineFillRef.current && lineTrackRef.current) {
        gsap.set(lineFillRef.current, { scaleY: 0 });
        ScrollTrigger.create({
          trigger: lineTrackRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: 0.4,
          onUpdate: (self) => {
            if (lineFillRef.current) {
              gsap.set(lineFillRef.current, { scaleY: self.progress });
            }
          },
        });
      }

      entryRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 40 });

        ScrollTrigger.create({
          trigger: el,
          start: "top 80%",
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            });
            const dot = dotRefs.current[i];
            if (dot) {
              gsap.to(dot, {
                scale: 1.5,
                backgroundColor: "#fff",
                borderColor: "rgba(255,255,255,0.5)",
                duration: 0.4,
                ease: "elastic.out(1, 0.6)",
              });
            }
            // Quote word-by-word reveal
            const quoteWords = el.querySelectorAll("[data-quote-word]");
            const cursor = el.querySelector("[data-quote-cursor]");
            if (cursor) {
              gsap.to(cursor, { opacity: 1, duration: 0.1, delay: 0.7 });
              gsap.to(cursor, { opacity: 0, duration: 0.15, repeat: -1, yoyo: true, delay: 0.7, repeatDelay: 0.3 });
            }
            quoteWords.forEach((w, wi) => {
              gsap.to(w, {
                opacity: 1,
                duration: 0.08,
                delay: 0.8 + wi * 0.06,
                ease: "none",
              });
            });
            // Hide cursor after quote finishes
            if (cursor && quoteWords.length > 0) {
              gsap.to(cursor, { opacity: 0, duration: 0.2, delay: 0.8 + quoteWords.length * 0.06 + 0.5, overwrite: true });
            }

            // Annotation scribble in
            const ann = annotationRefs.current[i];
            if (ann) {
              const chars = ann.querySelectorAll<HTMLSpanElement>("[data-char]");
              chars.forEach((ch, ci) => {
                gsap.to(ch, {
                  opacity: 1,
                  y: 0,
                  duration: 0.08,
                  delay: 0.4 + ci * 0.04,
                  ease: "power1.out",
                });
              });
              // Overall container fade
              gsap.to(ann, {
                opacity: 1,
                duration: 0.15,
                delay: 0.35,
              });
            }
          },
          once: true,
        });
      });

      // Set initial state for annotations
      annotationRefs.current.forEach((ann) => {
        if (!ann) return;
        gsap.set(ann, { opacity: 0 });
        const chars = ann.querySelectorAll("[data-char]");
        chars.forEach((ch) => gsap.set(ch, { opacity: 0, y: 4 }));
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-0 pb-14 md:pb-20 overflow-visible" data-section="journey">
      <style jsx global>{`
        @keyframes journey-breathe {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.14; }
        }
      `}</style>
      {/* Background video — extends upward to cover section transition above */}
      <div className="absolute -top-40 left-0 right-0 -bottom-40 overflow-hidden pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        }}
      >
        <video
          src="/journey-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: "journey-breathe 8s ease-in-out infinite" }}
        />
        <div className="absolute inset-0 bg-[#050508]/70" />
      </div>

      <div ref={headerRef} className="relative w-[90vw] max-w-5xl mx-auto px-6 mb-10 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          The Journey
        </h2>
        <p className="mt-3 text-white/25 text-sm md:text-base">
          From curious kid to full-time builder
        </p>
      </div>

      <div className="relative w-[90vw] max-w-5xl mx-auto px-6">
        <div className="relative">
          <div
            ref={lineTrackRef}
            className="absolute left-0 md:left-[72px] top-0 bottom-0 w-[2px]"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <div
              ref={lineFillRef}
              className="absolute top-0 left-0 w-full h-full origin-top"
              style={{
                background: "linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0.08))",
                transform: "scaleY(0)",
              }}
            />
          </div>

          <div className="space-y-16 md:space-y-20">
            {milestones.map((m, i) => (
              <div
                key={m.year}
                ref={(el) => { entryRefs.current[i] = el; }}
                className="relative pl-8 md:pl-24"
              >
                <div
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className="absolute left-0 md:left-[72px] top-2 w-[7px] h-[7px] rounded-full -translate-x-[2.5px]"
                  style={{
                    border: "1.5px solid rgba(255,255,255,0.15)",
                    backgroundColor: "transparent",
                  }}
                />

                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                    {m.year}
                  </span>
                  <span className="text-[10px] font-mono text-white/20 tracking-wider">
                    AGE {m.age}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-white/90 mb-2">
                  {m.title}
                </h3>
                <p className="text-sm md:text-base text-white/30 leading-relaxed mb-4 max-w-2xl">
                  {m.body}
                </p>
                <p
                  className="text-lg md:text-xl text-white/25 italic"
                  style={{ fontFamily: "var(--font-caveat)" }}
                >
                  &ldquo;{m.quote.split(" ").map((word, wi) => (
                    <span key={wi} data-quote-word className="inline-block mr-[0.3em]" style={{ opacity: 0 }}>
                      {word}
                    </span>
                  ))}&rdquo;
                  <span data-quote-cursor className="inline-block w-[2px] h-[1em] bg-white/30 align-middle ml-0.5" style={{ opacity: 0 }} />
                </p>

                {/* Margin annotation — scribbles in character by character */}
                {(m as { annotation?: string }).annotation && (
                  <span
                    ref={(el) => { annotationRefs.current[i] = el; }}
                    className="hidden lg:block absolute -right-8 xl:-right-16 top-1 select-none pointer-events-none"
                    style={{
                      fontFamily: "var(--font-caveat)",
                      fontSize: "15px",
                      color: "rgba(255,235,120,0.35)",
                      whiteSpace: "nowrap",
                      transform: `rotate(${-3 + (i % 2) * 2}deg)`,
                    }}
                  >
                    {(m as { annotation?: string }).annotation!.split("").map((ch, ci) => (
                      <span key={ci} data-char className="inline-block" style={{ opacity: 0 }}>
                        {ch === " " ? "\u00A0" : ch}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
