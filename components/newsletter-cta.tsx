"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundEngine } from "@/lib/sounds";
import { NewsletterEnvelope } from "@/components/newsletter-envelope";

gsap.registerPlugin(ScrollTrigger);

const TITLE = "Context Engineering";

export function NewsletterCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* envelope: pulled open on hover (desktop) or tap (touch); after a
     subscribe it closes and takes the seal, and stays closed */
  const [open, setOpen] = useState(false);
  const [stamp, setStamp] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (leftRef.current) gsap.set(leftRef.current, { opacity: 0, x: -30 });
      if (rightRef.current) gsap.set(rightRef.current, { opacity: 0, y: 24 });

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
                onStart: i % 3 === 0 ? () => soundEngine.playThrottled("typing", 100) : undefined,
              });
            });
          }
          if (rightRef.current) {
            gsap.to(rightRef.current, { opacity: 1, y: 0, duration: 0.9, delay: 0.2, ease: "power3.out" });
          }
        },
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting || submitted) return;
    soundEngine.play("click");
    setSubmitting(true);

    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter" }),
      });
      setEmail("");
      setSubmitted(true);
      setOpen(false);
      setStamp((n) => n + 1);
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative py-10 md:py-20">
      <div className="w-[90vw] max-w-6xl mx-auto px-4 md:px-6">
        <div
          className="relative grid grid-cols-1 md:grid-cols-[1fr_1.15fr] gap-12 md:gap-0 items-center
            md:before:content-[''] md:before:absolute md:before:left-[46.5%] md:before:top-[-8%] md:before:bottom-[-8%] md:before:w-px md:before:bg-white/[0.07]
            md:after:content-[''] md:after:absolute md:after:left-[46.5%] md:after:top-1/2 md:after:w-[3px] md:after:h-[3px] md:after:-translate-x-1/2 md:after:-translate-y-1/2 md:after:rounded-full md:after:bg-white/25"
        >
          {/* Left: the pitch and the form */}
          <div ref={leftRef} className="md:pr-12">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/25 mb-5 block">
              Newsletter
            </span>
            <h2 data-typewriter className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white tracking-tight leading-[1.05] mb-4">
              {/* each word is one unbreakable box; the letters inside are the
                  typewriter's targets, revealed in document order */}
              {TITLE.split(" ").map((word, w, words) => (
                <span key={word} className="inline-block whitespace-nowrap">
                  {word.split("").map((ch, i) => (
                    <span key={i} data-tw-char className="inline-block" style={{ opacity: 0 }}>
                      {ch}
                    </span>
                  ))}
                  {w < words.length - 1 ? "\u00A0" : null}
                </span>
              ))}
            </h2>
            <p className="text-base md:text-lg text-white/45 leading-relaxed mb-7 max-w-md">
              A weekly breakdown of how to build better with AI. Prompting strategies, agent architectures, and the context patterns that separate good outputs from great ones.
            </p>

            <div className="relative max-w-md" style={{ minHeight: "46px" }}>
              {submitted ? (
                <p
                  className="text-[11px] font-mono tracking-[0.25em] uppercase pt-3"
                  style={{ color: "rgba(200,170,80,0.6)" }}
                >
                  Sealed. Next issue lands in your inbox.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-3 items-center">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 min-w-0 rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors duration-300 focus:border-white/25"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  />
                  <button
                    type="submit"
                    data-magnetic
                    disabled={submitting}
                    className="px-5 py-3 rounded-lg text-sm font-semibold transition-all duration-300 shrink-0 overflow-hidden whitespace-nowrap"
                    style={{ background: "white", color: "#050508" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.9)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
                  >
                    {submitting ? "..." : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right: the sealed issue */}
          <div
            ref={rightRef}
            className="relative md:pl-12"
            onPointerEnter={(event) => {
              if (event.pointerType !== "touch" && !submitted) setOpen(true);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "touch") setOpen(false);
            }}
          >
            <NewsletterEnvelope
              open={open}
              stamp={stamp}
              onTap={() => {
                if (!submitted) setOpen((o) => !o);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
