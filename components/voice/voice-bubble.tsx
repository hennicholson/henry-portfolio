"use client";

import { useRef, useEffect, useState } from "react";
import { useVoice } from "./voice-provider";
import { Mic, X } from "lucide-react";
import gsap from "gsap";

export function VoiceBubble() {
  const { status, isSpeaking, startConversation, endConversation } = useVoice();
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  // Delayed entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      if (bubbleRef.current) {
        gsap.fromTo(
          bubbleRef.current,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }
        );
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (status === "connected") {
      endConversation();
    } else if (status === "disconnected") {
      startConversation();
    }
  };

  const isActive = status === "connected";
  const isConnecting = status === "connecting";

  if (!visible) return null;

  return (
    <button
      ref={bubbleRef}
      onClick={handleClick}
      disabled={isConnecting}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full transition-all duration-300 opacity-0"
      style={{
        width: 56,
        height: 56,
        background: isActive
          ? "rgba(255,255,255,0.12)"
          : "rgba(255,255,255,0.06)",
        border: `2px solid ${isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)"}`,
        boxShadow: isActive
          ? "0 0 20px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)"
          : "0 8px 32px rgba(0,0,0,0.4)",
      }}
      aria-label={isActive ? "End conversation" : "Talk to Henry"}
    >
      {/* Ping ring when active */}
      {isActive && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{
            border: "2px solid rgba(255,255,255,0.15)",
            animationDuration: "2s",
          }}
        />
      )}

      {/* Speaking pulse */}
      {isSpeaking && (
        <span
          className="absolute inset-[-4px] rounded-full"
          style={{
            border: "1px solid rgba(255,255,255,0.1)",
            animation: "voice-pulse 1s ease-in-out infinite",
          }}
        />
      )}

      {/* Icon */}
      {isConnecting ? (
        <div
          className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "transparent" }}
        />
      ) : isActive ? (
        <X size={20} className="text-white/60" />
      ) : (
        <Mic size={20} className="text-white/40" />
      )}

      {/* Pulse keyframes */}
      <style jsx global>{`
        @keyframes voice-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
    </button>
  );
}
