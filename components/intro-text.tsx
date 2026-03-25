"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const paragraph =
  "I\u2019ve been building things on the internet since I was 13 years old. What started as curiosity became an obsession \u2014 I taught myself to code, shipped my first SaaS product at 17, and went full-time at 19. Now I\u2019m building tools that help others bring their ideas to life.";

const drawAnnotations: Record<string, "circle" | "wavy" | "straight"> = {
  "13": "circle",
  "obsession": "wavy",
  "shipped": "straight",
};

export function IntroText() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const signatureRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLVideoElement>(null);

  const words = paragraph.split(" ");
  const thirteenIndex = words.findIndex((w) => w === "13");

  const cakeClicked = useRef(false);
  const handleCakeClick = useCallback(() => {
    if (cakeClicked.current || !cakeRef.current) return;
    cakeClicked.current = true;

    const rect = cakeRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
      const emoji = document.createElement("div");
      emoji.textContent = "\u{1F382}";
      emoji.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:24px;pointer-events:none;z-index:100;`;
      document.body.appendChild(emoji);

      gsap.to(emoji, {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.8) * 350,
        rotation: (Math.random() - 0.5) * 360,
        opacity: 0,
        scale: 0.5 + Math.random(),
        duration: 1 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => emoji.remove(),
      });
    }

    setTimeout(() => { cakeClicked.current = false; }, 3000);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      wordRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0.12 });
      });

      if (cakeRef.current) gsap.set(cakeRef.current, { scale: 0, opacity: 0 });
      if (signatureRef.current) gsap.set(signatureRef.current, { opacity: 0, y: 10 });

      // Set all draw paths to hidden
      const drawPaths = containerRef.current!.querySelectorAll("[data-draw]");
      drawPaths.forEach((p) => {
        const len = (p as SVGGeometryElement).getTotalLength?.() || 120;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 0.3,
        },
      });

      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        tl.to(el, { opacity: 1, duration: 1, ease: "none" }, i * 0.5);

        if (i === thirteenIndex && cakeRef.current) {
          tl.to(cakeRef.current, { scale: 1, opacity: 1, duration: 2, ease: "elastic.out(1, 0.5)" }, i * 0.5);
        }

        // Find draw SVG inside this word's parent
        const parent = el?.parentElement;
        if (parent) {
          const drawEl = parent.querySelector("[data-draw]");
          if (drawEl) {
            tl.to(drawEl, { strokeDashoffset: 0, duration: 3, ease: "power2.out" }, i * 0.5 + 0.3);
          }
        }
      });

      if (signatureRef.current) {
        tl.to(signatureRef.current, { opacity: 1, y: 0, duration: 2, ease: "power2.out" });
      }

      if (cakeRef.current) {
        gsap.to(cakeRef.current, { y: -8, rotation: 12, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [thirteenIndex]);

  return (
    <section ref={sectionRef} className="relative py-14 md:py-20" data-section="story">
      <div ref={containerRef} className="w-[90vw] max-w-4xl mx-auto px-6 relative">
        <video
          ref={cakeRef}
          src="/cake-spin.webm"
          autoPlay muted loop playsInline
          onClick={handleCakeClick}
          className="absolute -top-16 -right-8 md:-top-20 md:-right-12 w-36 md:w-48 cursor-pointer z-20"
          style={{ mixBlendMode: "screen" }}
        />

        <p
          className="flex flex-wrap text-2xl md:text-4xl lg:text-5xl leading-[1.4] md:leading-[1.35] relative z-[2]"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          {words.map((word, i) => {
            const clean = word.replace(/[^a-zA-Z0-9]/g, "");
            const annotation = drawAnnotations[clean] || drawAnnotations[word];

            return (
              <span key={i} className="relative mx-[0.2em] my-[0.05em]">
                <span className="opacity-[0.08] select-none" aria-hidden="true">
                  {word}
                </span>
                <span
                  ref={(el) => { wordRefs.current[i] = el; }}
                  className={`absolute inset-0 ${
                    word === "13" ? "text-white font-bold" : "text-white/80"
                  }`}
                >
                  {word}
                </span>

                {annotation === "circle" && (
                  <svg
                    className="absolute -inset-x-2 -inset-y-1 pointer-events-none"
                    style={{ width: "calc(100% + 16px)", height: "calc(100% + 8px)" }}
                    viewBox="0 0 60 32"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <ellipse
                      cx="30" cy="16" rx="27" ry="13"
                      stroke="rgba(255,235,120,0.35)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      transform="rotate(-3 30 16)"
                      data-draw
                    />
                  </svg>
                )}
                {annotation === "wavy" && (
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-2.5 pointer-events-none"
                    viewBox="0 0 80 8"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M2 5 C 10 2, 18 8, 26 5 C 34 2, 42 8, 50 5 C 58 2, 66 8, 78 5"
                      stroke="rgba(255,235,120,0.3)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      data-draw
                    />
                  </svg>
                )}
                {annotation === "straight" && (
                  <svg
                    className="absolute -bottom-0.5 left-0 w-full h-2 pointer-events-none"
                    viewBox="0 0 60 6"
                    preserveAspectRatio="none"
                    fill="none"
                  >
                    <path
                      d="M2 4 C 15 2, 30 5, 58 3"
                      stroke="rgba(255,235,120,0.3)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      data-draw
                    />
                  </svg>
                )}
              </span>
            );
          })}
        </p>

        <div ref={signatureRef} className="mt-14 flex items-center gap-3">
          <div className="w-10 h-px bg-white/10" />
          <span className="text-xs font-mono text-white/20 tracking-widest uppercase">
            Henry Nicholson, 2026
          </span>
        </div>
      </div>
    </section>
  );
}
