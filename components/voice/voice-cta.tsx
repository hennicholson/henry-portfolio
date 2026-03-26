"use client";

import { useRef, useEffect } from "react";
import { Mic } from "lucide-react";
import { useVoice } from "./voice-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function VoiceCTA() {
  const { startConversation, status } = useVoice();
  const ref = useRef<HTMLDivElement>(null);
  const isConnecting = status === "connecting";

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.set(ref.current!, { opacity: 0, y: 16 });
      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 95%",
        onEnter: () => {
          gsap.to(ref.current!, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
        },
        once: true,
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes mic-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
      `}</style>
      <div ref={ref} className="flex justify-center py-6">
        <button
          onClick={() => startConversation()}
          disabled={isConnecting || status === "connected"}
          className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.2)";
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
          }}
        >
          {isConnecting ? (
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin relative z-[1]"
              style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "transparent" }}
            />
          ) : (
            <span className="relative z-[1]" style={{ animation: "mic-pulse 2s ease-in-out infinite" }}>
              <Mic size={14} className="text-white/40 group-hover:text-white/60 transition-colors" />
            </span>
          )}
          <span className="text-xs sm:text-sm text-white/40 group-hover:text-white/60 font-medium tracking-wide transition-colors relative z-[1]">
            {isConnecting ? "Connecting..." : "Talk to Henry"}
          </span>
        </button>
      </div>
    </>
  );
}
