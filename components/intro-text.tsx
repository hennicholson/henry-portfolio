"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const paragraph =
  "I\u2019ve been building things on the internet since I was 13 years old. What started as curiosity became an obsession \u2014 I taught myself to code, shipped my first SaaS product at 17, and went full-time at 19. Now I\u2019m building tools that help others bring their ideas to life.";

export function IntroText() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const signatureRef = useRef<HTMLDivElement>(null);
  const cakeRef = useRef<HTMLVideoElement>(null);

  const words = paragraph.split(" ");
  const thirteenIndex = words.findIndex((w) => w === "13");

  // Cake explosion easter egg
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

    // Reset after a few seconds so it can be triggered again
    setTimeout(() => { cakeClicked.current = false; }, 3000);
  }, []);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Set all words to dim
      wordRefs.current.forEach((el) => {
        if (el) gsap.set(el, { opacity: 0.12 });
      });

      if (cakeRef.current) gsap.set(cakeRef.current, { scale: 0, opacity: 0 });
      if (signatureRef.current) gsap.set(signatureRef.current, { opacity: 0, y: 10 });

      // Word-by-word reveal on scroll — each word brightens as you scroll through
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

        // Pop cake in when "13" word reveals
        if (i === thirteenIndex && cakeRef.current) {
          tl.to(cakeRef.current, { scale: 1, opacity: 1, duration: 2, ease: "elastic.out(1, 0.5)" }, i * 0.5);
        }
      });

      // Signature after all words
      if (signatureRef.current) {
        tl.to(signatureRef.current, { opacity: 1, y: 0, duration: 2, ease: "power2.out" });
      }

      // Cake float loop
      if (cakeRef.current) {
        gsap.to(cakeRef.current, { y: -8, rotation: 12, duration: 2.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [thirteenIndex]);

  return (
    <section ref={sectionRef} className="relative py-14 md:py-20" data-section="story">
      <div ref={containerRef} className="w-[90vw] max-w-4xl mx-auto px-6 relative">
        {/* Cake */}
        <video
          ref={cakeRef}
          src="/cake-spin.webm"
          autoPlay muted loop playsInline
          onClick={handleCakeClick}
          className="absolute -top-16 -right-8 md:-top-20 md:-right-12 w-36 md:w-48 cursor-pointer z-20"
          style={{ mixBlendMode: "screen" }}
        />

        {/* Word-by-word reveal text */}
        <p
          className="flex flex-wrap text-2xl md:text-4xl lg:text-5xl leading-[1.4] md:leading-[1.35] relative z-[2]"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          {words.map((word, i) => (
            <span key={i} className="relative mx-[0.2em] my-[0.05em]">
              {/* Ghost word (always visible at low opacity for layout) */}
              <span className="opacity-[0.08] select-none" aria-hidden="true">
                {word}
              </span>
              {/* Animated word */}
              <span
                ref={(el) => { wordRefs.current[i] = el; }}
                className={`absolute inset-0 ${
                  word === "13" ? "text-white font-bold" : "text-white/80"
                }`}
              >
                {word}
              </span>
            </span>
          ))}
        </p>

        {/* Signature */}
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
