"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const messages = [
  {
    author: "Sarah Chen",
    initials: "SC",
    color: "rgba(59, 130, 246, 0.25)",
    timestamp: "2:34 PM",
    text: "Henry brings a rare combination of technical skill and creative vision. He doesn\u2019t just build things \u2014 he builds the right things, fast.",
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

function TypingDots() {
  return (
    <div className="flex items-center gap-2 h-9">
      <span className="text-xs text-white/30">typing</span>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "0ms" }} />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "150ms" }} />
        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}

export default function SlackTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealedMessages, setRevealedMessages] = useState<Set<number>>(new Set());
  const [typingMessages, setTypingMessages] = useState<Set<number>>(new Set());
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Container fade in
      gsap.from("[data-slack]", {
        scrollTrigger: { trigger: "[data-slack]", start: "top 82%", once: true },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      });

      // Trigger message reveal sequence
      ScrollTrigger.create({
        trigger: "[data-slack]",
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (hasTriggered.current) return;
          hasTriggered.current = true;

          messages.forEach((_, i) => {
            // Start typing
            setTimeout(() => {
              setTypingMessages((prev) => new Set(prev).add(i));
            }, i * 1400);

            // Stop typing, reveal message
            setTimeout(() => {
              setTypingMessages((prev) => {
                const next = new Set(prev);
                next.delete(i);
                return next;
              });
              setRevealedMessages((prev) => new Set(prev).add(i));
            }, i * 1400 + 800);
          });
        },
      });

      // Typing indicator at bottom
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

  // Animate reactions after message reveal
  useEffect(() => {
    if (!sectionRef.current) return;
    revealedMessages.forEach((i) => {
      const msg = sectionRef.current!.querySelector(`[data-msg="${i}"]`);
      if (!msg) return;
      const reactions = msg.querySelectorAll("[data-rx]");
      reactions.forEach((rx, j) => {
        gsap.fromTo(rx,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, delay: j * 0.05 + 0.2, ease: "back.out(1.6)" }
        );
      });
    });
  }, [revealedMessages]);

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
              <div key={index} data-msg={index} className="flex gap-3">
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

                  {/* Typing indicator OR message content */}
                  {typingMessages.has(index) && !revealedMessages.has(index) && (
                    <TypingDots />
                  )}

                  <div style={{
                    opacity: revealedMessages.has(index) ? 1 : 0,
                    transform: revealedMessages.has(index) ? "translateY(0)" : "translateY(8px)",
                    transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
                    display: typingMessages.has(index) && !revealedMessages.has(index) ? "none" : "block",
                  }}>
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
                            opacity: 0,
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
              </div>
            ))}

            {/* Typing indicator */}
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
              <TypingDots />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
