"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { X } from "lucide-react";
import { useVoice, type CallSummaryData } from "./voice-provider";

gsap.registerPlugin(ScrollToPlugin);

const SECTION_LABELS: Record<string, string> = {
  hero: "Intro",
  story: "Story",
  journey: "Journey",
  stack: "Toolbox",
  projects: "Projects",
  proof: "Social Proof",
  testimonials: "Testimonials",
  footer: "Contact",
};

const AUTO_DISMISS_MS = 12000;

export function CallSummary() {
  const { callSummary, dismissSummary } = useVoice();
  const cardRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-fill from agent-captured data
  useEffect(() => {
    if (callSummary) {
      setName(callSummary.capturedName || "");
      setEmail(callSummary.capturedEmail || "");
      setSubmitted(false);
    }
  }, [callSummary]);

  const doDismiss = () => {
    if (!cardRef.current) { dismissSummary(); return; }
    gsap.to(cardRef.current, {
      opacity: 0, y: 20, scale: 0.95,
      duration: 0.3, ease: "power2.in",
      onComplete: dismissSummary,
    });
  };

  // Entry animation + auto-dismiss
  useEffect(() => {
    if (!callSummary || !cardRef.current) return;

    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 40, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" }
    );

    if (progressRef.current) {
      gsap.fromTo(progressRef.current,
        { scaleX: 1 },
        { scaleX: 0, duration: AUTO_DISMISS_MS / 1000, ease: "none" }
      );
    }

    dismissTimerRef.current = setTimeout(() => {
      dismissSummary();
    }, AUTO_DISMISS_MS);

    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callSummary]);

  const handleSubmit = async () => {
    if (!name.trim() && !email.trim()) return;
    setSubmitting(true);

    // Cancel auto-dismiss while submitting
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    if (progressRef.current) gsap.killTweensOf(progressRef.current);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim() || null,
          source: "call_summary_card",
          metadata: {
            sections_visited: callSummary?.sectionsVisited,
            projects_viewed: callSummary?.projectsViewed,
            call_duration: callSummary?.durationSeconds,
          },
        }),
      });
      if (res.ok) setSubmitted(true);
    } catch {
      // Silently fail
    }
    setSubmitting(false);
  };

  const scrollTo = (section: string) => {
    const target = document.querySelector(`[data-section="${section}"]`);
    if (target) {
      gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1.2, ease: "power3.inOut" });
    }
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  if (!callSummary) return null;

  return (
    <div
      ref={cardRef}
      className="fixed bottom-20 right-6 z-[55] w-[320px] rounded-xl overflow-hidden"
      style={{
        background: "rgba(12, 12, 20, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        opacity: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <span className="text-[11px] font-mono tracking-wider uppercase text-white/40">
          Call Summary
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/20">
            {formatDuration(callSummary.durationSeconds)}
          </span>
          <button onClick={doDismiss} className="text-white/20 hover:text-white/50 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 space-y-3">
        {/* Sections visited */}
        {callSummary.sectionsVisited.length > 0 && (
          <div>
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1.5">You explored</p>
            <div className="flex flex-wrap gap-1">
              {callSummary.sectionsVisited.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono text-white/50 hover:text-white/80 transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {SECTION_LABELS[s] || s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Projects viewed */}
        {callSummary.projectsViewed.length > 0 && (
          <div>
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1.5">Projects viewed</p>
            <div className="flex flex-wrap gap-1">
              {callSummary.projectsViewed.map((p) => (
                <span
                  key={p}
                  className="px-2 py-0.5 rounded-full text-[10px] font-mono text-green-400/60"
                  style={{ background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.1)" }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact form */}
        {!submitted ? (
          <div>
            <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1.5">
              {callSummary.capturedName || callSummary.capturedEmail
                ? "Verify your details"
                : "Want me to reach out?"}
            </p>
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md text-[12px] font-mono text-white/70 placeholder-white/20 outline-none focus:border-white/15 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-md text-[12px] font-mono text-white/70 placeholder-white/20 outline-none focus:border-white/15 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting || (!name.trim() && !email.trim())}
                className="w-full py-1.5 rounded-md text-[11px] font-mono tracking-wider uppercase transition-all disabled:opacity-30"
                style={{
                  background: "rgba(74,222,128,0.1)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  color: "rgba(74,222,128,0.8)",
                }}
              >
                {submitting ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-[11px] font-mono text-green-400/60">Sent! I'll be in touch.</p>
          </div>
        )}
      </div>

      {/* Auto-dismiss progress bar */}
      <div className="h-[2px] w-full" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div
          ref={progressRef}
          className="h-full origin-left"
          style={{ background: "rgba(74,222,128,0.3)" }}
        />
      </div>
    </div>
  );
}
