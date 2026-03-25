"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const formRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.set(leftRef.current, { opacity: 0, x: -30 });
      }
      if (rightRef.current) {
        gsap.set(rightRef.current, { opacity: 0, x: 30 });
      }

      // Topic items
      const topicItems = sectionRef.current!.querySelectorAll("[data-topic-item]");
      gsap.set(topicItems, { opacity: 0, y: 12 });

      // Badges — start invisible
      const badges = sectionRef.current!.querySelectorAll("[data-badge]");
      gsap.set(badges, { opacity: 0, scale: 2.5 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        onEnter: () => {
          if (leftRef.current) {
            gsap.to(leftRef.current, { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" });
            const chars = leftRef.current.querySelectorAll("[data-tw-char]");
            chars.forEach((ch, i) => {
              gsap.to(ch, {
                opacity: 1,
                duration: 0.03,
                delay: 0.3 + i * 0.045,
                ease: "none",
              });
            });
          }
          if (rightRef.current) {
            gsap.to(rightRef.current, { opacity: 1, x: 0, duration: 0.7, delay: 0.15, ease: "power3.out" });
          }
          gsap.to(topicItems, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            delay: 0.4,
            ease: "power2.out",
          });
          gsap.to(badges, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.2,
            delay: 0.9,
            ease: "power3.out",
          });
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Animate seal in when submitted
  useEffect(() => {
    if (!submitted || !sealRef.current) return;
    const seal = sealRef.current;

    gsap.fromTo(seal,
      { opacity: 0, scale: 1.6, rotation: -15 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.3, ease: "back.out(1.4)" }
    );

    // Gold shimmer particles
    const timer1 = setTimeout(() => {
      const rect = seal.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement("div");
        const size = 3 + Math.random() * 4;
        dot.style.cssText = `position:fixed;left:${rect.left + rect.width / 2}px;top:${rect.top + rect.height / 2}px;width:${size}px;height:${size}px;border-radius:50%;background:rgba(200,170,80,0.6);pointer-events:none;z-index:100;`;
        document.body.appendChild(dot);
        gsap.to(dot, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 80,
          opacity: 0,
          scale: 0.2,
          duration: 0.6 + Math.random() * 0.4,
          ease: "power2.out",
          onComplete: () => dot.remove(),
        });
      }
    }, 150);

    // Fade out and reset
    const timer2 = setTimeout(() => {
      gsap.to(seal, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => setSubmitted(false),
      });
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting || submitted) return;
    setSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      setEmail("");
      setSubmitted(true);

      // Animation happens in useEffect when submitted changes

    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
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
            <h2 data-typewriter className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3">
              {"Context Engineering".split("").map((ch, i) => (
                <span key={i} data-tw-char className="inline-block" style={{ opacity: 0 }}>
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </h2>
            <p className="text-sm md:text-base text-white/35 leading-relaxed mb-6 max-w-md">
              A weekly breakdown of how to build better with AI. Prompting strategies, agent architectures, and the context patterns that separate good outputs from great ones.
            </p>

            <div ref={formRowRef} className="relative max-w-sm" style={{ minHeight: "44px" }}>
              {/* Form — hidden during seal animation */}
              <form
                onSubmit={handleSubmit}
                className="flex gap-2 items-center"
                style={{ visibility: submitted ? "hidden" : "visible" }}
              >
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
                  ref={buttonRef}
                  type="submit"
                  data-magnetic
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shrink-0 overflow-hidden whitespace-nowrap"
                  style={{
                    background: "white",
                    color: "#050508",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
                >
                  {submitting ? "..." : "Subscribe"}
                </button>
              </form>

              {/* Wax seal — replaces form on submit */}
              {submitted && (
                <div
                  ref={sealRef}
                  className="absolute inset-0 z-10 flex items-center justify-center"
                  style={{ opacity: 0 }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src="/wax-seal.png"
                      alt="HN wax seal"
                      width={72}
                      height={72}
                      className="drop-shadow-[0_6px_24px_rgba(180,140,60,0.5)]"
                    />
                    <span
                      className="text-[10px] font-mono tracking-[0.3em] uppercase"
                      style={{ color: "rgba(200,170,80,0.5)" }}
                    >
                      Sealed
                    </span>
                  </div>
                </div>
              )}
            </div>
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
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase block mb-4 marquee-chrome-text">
                What You&apos;ll Get
              </span>

              <div className="space-y-3 mb-5">
                {topics.map((topic, i) => (
                  <div key={i} data-topic-item className="flex items-start gap-2.5">
                    <span className="text-[10px] font-mono text-white/15 mt-0.5 shrink-0">
                      0{i + 1}
                    </span>
                    <p className="text-sm text-white/35 leading-relaxed">
                      {topic}
                    </p>
                  </div>
                ))}
              </div>

              <div data-badges className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                {["Free", "Weekly", "No spam"].map((badge, i) => (
                  <span key={badge} className="flex items-center gap-3">
                    {i > 0 && <span className="text-white/10">&middot;</span>}
                    <span
                      data-badge
                      className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/15"
                    >
                      {badge}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
