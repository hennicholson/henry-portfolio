"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const messages = [
  {
    author: "Sarah Chen",
    initials: "SC",
    color: "rgba(59, 130, 246, 0.25)",
    timestamp: "2:34 PM",
    text: "Henry brings a rare combination of technical skill and creative vision. He doesn't just build things \u2014 he builds the right things, fast.",
    reactions: [
      { emoji: "\uD83D\uDD25", count: 3 },
      { emoji: "\uD83D\uDCAF", count: 2 },
    ],
    thread: { replies: 3, lastReply: "2:45 PM" },
  },
  {
    author: "Alex Rivera",
    initials: "AR",
    color: "rgba(168, 85, 247, 0.25)",
    timestamp: "3:12 PM",
    text: "ForeFront changed how I think about AI. Henry made something complex feel approachable and actually useful for students like me.",
    reactions: [
      { emoji: "\uD83D\uDE4C", count: 5 },
      { emoji: "\u2764\uFE0F", count: 4 },
    ],
  },
  {
    author: "Jordan Lee",
    initials: "JL",
    color: "rgba(34, 197, 94, 0.25)",
    timestamp: "4:56 PM",
    text: "Context Engineering is the one newsletter I actually read every week. Clear, practical, no fluff. Henry has a gift for making AI tangible.",
    reactions: [
      { emoji: "\uD83D\uDCA1", count: 6 },
      { emoji: "\uD83D\uDCDA", count: 2 },
      { emoji: "\uD83D\uDC4F", count: 3 },
    ],
  },
];

export default function SlackTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Container
      gsap.from("[data-slack]", {
        scrollTrigger: { trigger: "[data-slack]", start: "top 82%", once: true },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      });

      // Each message — individual ScrollTriggers
      const msgs = sectionRef.current!.querySelectorAll("[data-msg]");
      msgs.forEach((msg, i) => {
        gsap.from(msg, {
          scrollTrigger: { trigger: msg, start: "top 90%", once: true },
          opacity: 0,
          y: 16,
          duration: 0.5,
          delay: i * 0.08,
          ease: "power3.out",
        });

        const reactions = msg.querySelectorAll("[data-rx]");
        reactions.forEach((rx, j) => {
          gsap.from(rx, {
            scrollTrigger: { trigger: msg, start: "top 88%", once: true },
            scale: 0.5,
            opacity: 0,
            duration: 0.35,
            delay: i * 0.08 + j * 0.05 + 0.25,
            ease: "back.out(1.6)",
          });
        });
      });

      // Typing indicator
      gsap.from("[data-typing]", {
        scrollTrigger: { trigger: "[data-typing]", start: "top 92%", once: true },
        opacity: 0,
        duration: 0.4,
        delay: 0.5,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-section="testimonials" className="py-14 md:py-20">
      <div className="w-[90vw] max-w-5xl mx-auto px-6">
        <div
          data-slack
          className="rounded-xl overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(12, 12, 20, 0.9) 0%, rgba(8, 8, 14, 0.95) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          {/* Channel Header */}
          <div
            className="px-5 md:px-6 py-3.5 md:py-4"
            style={{
              backgroundColor: "rgba(12, 12, 20, 0.95)",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
            }}
          >
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-base md:text-lg font-bold text-white/90">
                # what-people-say
              </span>
              <span className="text-xs md:text-sm text-white/30 hidden sm:inline">
                Testimonials &amp; kind words
              </span>
            </div>
            <div className="font-mono text-[11px] text-white/20">
              3 members &middot; &#x1F4CC; 3 pinned items
            </div>
          </div>

          {/* Messages */}
          <div className="px-5 md:px-6 py-4 md:py-5 space-y-5">
            {messages.map((message, index) => (
              <div key={index} data-msg className="flex gap-3">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold select-none"
                  style={{
                    backgroundColor: message.color,
                    color: "rgba(255, 255, 255, 0.7)",
                  }}
                >
                  {message.initials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Author + time */}
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="font-bold text-sm text-white/80">
                      {message.author}
                    </span>
                    <span className="font-mono text-[11px] text-white/20">
                      {message.timestamp}
                    </span>
                  </div>

                  {/* Text */}
                  <p className="text-sm leading-relaxed text-white/50 mb-2">
                    {message.text}
                  </p>

                  {/* Reactions */}
                  <div className="flex flex-wrap gap-1.5">
                    {message.reactions.map((rx, rIdx) => (
                      <span
                        key={rIdx}
                        data-rx
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs cursor-default transition-all duration-200 hover:scale-105"
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                        }}
                      >
                        <span>{rx.emoji}</span>
                        <span className="font-mono text-[10px] text-white/35">
                          {rx.count}
                        </span>
                      </span>
                    ))}
                  </div>

                  {/* Thread */}
                  {message.thread && (
                    <button
                      className="mt-1.5 text-xs font-medium transition-colors duration-200"
                      style={{ color: "rgba(96,165,250,0.6)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "rgba(96,165,250,0.8)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(96,165,250,0.6)";
                      }}
                    >
                      {message.thread.replies} replies &middot; Last reply{" "}
                      {message.thread.lastReply}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator — always rendered, animated by GSAP */}
            <div data-typing className="flex gap-3 items-center">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold select-none"
                style={{
                  backgroundColor: "rgba(251, 191, 36, 0.25)",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                HN
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/30">typing</span>
                <div className="flex gap-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
