"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Henry brings a rare combination of technical skill and creative vision. He doesn\u2019t just build things \u2014 he builds the right things, fast.",
    name: "Global Prairie",
    role: "Colleague",
  },
  {
    quote:
      "ForeFront changed how I think about AI. Henry made something complex feel approachable and actually useful for students like me.",
    name: "ForeFront USD",
    role: "Community Member",
  },
  {
    quote:
      "Adventures in AI is the one newsletter I actually read every week. Clear, practical, no fluff. Henry has a gift for making AI tangible.",
    name: "Newsletter Reader",
    role: "Subscriber",
  },
];

export function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.set(labelRef.current, { opacity: 0, y: 16 });
        ScrollTrigger.create({
          trigger: labelRef.current,
          start: "top 85%",
          onEnter: () => {
            gsap.to(labelRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
          },
          once: true,
        });
      }

      const cards = sectionRef.current!.querySelectorAll<HTMLElement>("[data-proof-card]");
      gsap.set(cards, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: cards[0],
        start: "top 80%",
        onEnter: () => {
          gsap.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-14 md:py-20" data-section="proof">
      <div className="w-[90vw] max-w-5xl mx-auto px-6">
        <div ref={labelRef} className="mb-8 text-center">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/20">
            What People Say
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              data-proof-card
              className="relative rounded-xl p-5 md:p-6 overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(12, 12, 20, 0.8) 0%, rgba(8, 8, 14, 0.9) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Quote watermark */}
              <span
                className="absolute top-2 left-4 text-[64px] leading-none select-none pointer-events-none text-white/[0.03]"
                style={{ fontFamily: "var(--font-caveat)" }}
              >
                &ldquo;
              </span>

              <p className="text-sm text-white/40 leading-relaxed mb-5 relative z-[1]">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="relative z-[1]">
                <p className="text-sm font-semibold text-white/60">{t.name}</p>
                <p className="text-[10px] font-mono text-white/20 tracking-wider">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
