"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function NewsletterCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.set(leftRef.current, { opacity: 0, x: -30 });
      }
      if (rightRef.current) {
        gsap.set(rightRef.current, { opacity: 0, x: 30 });
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        onEnter: () => {
          if (leftRef.current) {
            gsap.to(leftRef.current, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" });
          }
          if (rightRef.current) {
            gsap.to(rightRef.current, { opacity: 1, x: 0, duration: 0.7, delay: 0.15, ease: "power3.out" });
          }
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder — user will add Beehiiv/Substack endpoint later
    if (email) {
      window.open(`https://adventuresinai.beehiiv.com/subscribe?email=${encodeURIComponent(email)}`, "_blank");
    }
  };

  return (
    <section ref={sectionRef} className="relative py-14 md:py-20">
      <div className="w-[90vw] max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
          {/* Left — CTA */}
          <div ref={leftRef} className="md:col-span-3">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/20 mb-4 block">
              Newsletter
            </span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3"
              style={{ fontFamily: "var(--font-caveat)" }}
            >
              Adventures in AI
            </h2>
            <p className="text-sm md:text-base text-white/35 leading-relaxed mb-6 max-w-md">
              A weekly newsletter on AI tools, techniques, and strategies. Distilling what matters so you don&apos;t have to.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-colors duration-300 focus:border-white/20"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-300 shrink-0"
                style={{
                  background: "white",
                  color: "#050508",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Right — Issue preview */}
          <div ref={rightRef} className="md:col-span-2 relative">
            <div
              className="rounded-xl p-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(12, 12, 20, 0.8) 0%, rgba(8, 8, 14, 0.9) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Issue number watermark */}
              <span className="absolute top-2 right-4 text-[48px] font-bold leading-none text-white/[0.04] select-none pointer-events-none">
                53+
              </span>

              <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/20 block mb-3">
                Latest Issue
              </span>
              <h3 className="text-base font-semibold text-white/70 mb-2 tracking-tight">
                The Tools That Actually Matter in 2026
              </h3>
              <div className="space-y-1.5 mb-4">
                <p className="text-xs text-white/30 flex items-start gap-2">
                  <span className="text-white/10 mt-px">&bull;</span>
                  Why Claude Code changes everything for builders
                </p>
                <p className="text-xs text-white/30 flex items-start gap-2">
                  <span className="text-white/10 mt-px">&bull;</span>
                  The 3 AI video tools worth your time
                </p>
                <p className="text-xs text-white/30 flex items-start gap-2">
                  <span className="text-white/10 mt-px">&bull;</span>
                  What agencies get wrong about AI adoption
                </p>
              </div>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-white/25 hover:text-white/50 transition-colors duration-300"
              >
                Read Archive <ArrowUpRight size={10} />
              </a>
            </div>

            <p className="text-center mt-3 text-[9px] font-mono tracking-[0.2em] uppercase text-white/15">
              Issues Published
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
