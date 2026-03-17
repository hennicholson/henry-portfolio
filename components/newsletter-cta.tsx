"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const topics = [
  "Prompting patterns that actually work",
  "Context window strategies for complex tasks",
  "Building AI agents that don't hallucinate",
];

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
    if (email) {
      // Placeholder — connect to newsletter provider later
      console.log("Newsletter signup:", email);
      setEmail("");
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
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
              Context Engineering
            </h2>
            <p className="text-sm md:text-base text-white/35 leading-relaxed mb-6 max-w-md">
              A weekly breakdown of how to build better with AI. Prompting strategies, agent architectures, and the context patterns that separate good outputs from great ones.
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

          {/* Right — What you'll get */}
          <div ref={rightRef} className="md:col-span-2 relative">
            <div
              className="rounded-xl p-5 relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, rgba(12, 12, 20, 0.8) 0%, rgba(8, 8, 14, 0.9) 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/20 block mb-4">
                What You&apos;ll Get
              </span>

              <div className="space-y-3 mb-5">
                {topics.map((topic, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-[10px] font-mono text-white/15 mt-0.5 shrink-0">
                      0{i + 1}
                    </span>
                    <p className="text-sm text-white/35 leading-relaxed">
                      {topic}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/15">
                  Free
                </span>
                <span className="text-white/10">&middot;</span>
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/15">
                  Weekly
                </span>
                <span className="text-white/10">&middot;</span>
                <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/15">
                  No spam
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
