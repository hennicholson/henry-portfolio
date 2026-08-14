"use client";

import { useRef, useEffect, useState } from "react";
import { useVoice } from "./voice-provider";
import { CallSummary } from "./call-summary";
import { Mic, PhoneOff } from "lucide-react";
import gsap from "gsap";
import { soundEngine } from "@/lib/sounds";

function MiniWaveform({ speaking }: { speaking: boolean }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1.4, 2.0, 1.2, 2.4, 1.6].map((dur, i) => (
        <div
          key={i}
          className="w-[2.5px] rounded-full bg-white/60"
          style={{
            height: "14px",
            animationName: "waveBar",
            animationDuration: `${speaking ? dur * 0.4 : dur}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}

export function VoiceBubble() {
  const { status, isSpeaking, startConversation, endConversation, warm } = useVoice();
  const bubbleRef = useRef<HTMLButtonElement>(null);
  const [enteredOnce, setEnteredOnce] = useState(false);
  const [hovering, setHovering] = useState(false);

  const isActive = status === "connected";
  const isConnecting = status === "connecting";
  const isDisconnected = status === "disconnected";

  // Show bubble: either after 3s idle delay, or immediately when connecting/connected
  useEffect(() => {
    if (isActive || isConnecting) {
      setEnteredOnce(true);
      return;
    }

    if (!enteredOnce) {
      const timer = setTimeout(() => setEnteredOnce(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive, isConnecting, enteredOnce]);

  // Animate in when first becoming visible
  useEffect(() => {
    if (enteredOnce && bubbleRef.current) {
      gsap.fromTo(
        bubbleRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.4)" }
      );
    }
  }, [enteredOnce]);

  const handleClick = () => {
    if (isActive) {
      soundEngine.play("close");
      endConversation();
    } else if (isDisconnected) {
      soundEngine.play("chime");
      startConversation();
    }
  };

  if (!enteredOnce) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes waveBar {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        @keyframes voice-pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
      <button onPointerEnter={warm}
        ref={bubbleRef}
        onClick={handleClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        disabled={isConnecting}
        data-magnetic
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full transition-all duration-300 opacity-0"
        style={{
          width: isActive ? 52 : 56,
          height: isActive ? 52 : 56,
          background: isActive
            ? hovering
              ? "rgba(239,68,68,0.2)"
              : "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.06)",
          border: `2px solid ${
            isActive
              ? hovering
                ? "rgba(239,68,68,0.4)"
                : "rgba(255,255,255,0.2)"
              : "rgba(255,255,255,0.08)"
          }`,
          boxShadow: isActive
            ? "0 0 20px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 32px rgba(0,0,0,0.4)",
        }}
        aria-label={isActive ? "End conversation" : "Talk to Henry"}
      >
        {/* Ping ring when active */}
        {isActive && !hovering && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              border: "2px solid rgba(255,255,255,0.15)",
              animationDuration: "2s",
            }}
          />
        )}

        {/* Speaking pulse */}
        {isSpeaking && !hovering && (
          <span
            className="absolute inset-[-4px] rounded-full"
            style={{
              border: "1px solid rgba(255,255,255,0.1)",
              animation: "voice-pulse 1s ease-in-out infinite",
            }}
          />
        )}

        {/* Icon / waveform / hang up */}
        {isConnecting ? (
          <div
            className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
            style={{
              borderColor: "rgba(255,255,255,0.3)",
              borderTopColor: "transparent",
            }}
          />
        ) : isActive ? (
          hovering ? (
            <PhoneOff size={18} className="text-red-400/80" />
          ) : (
            <MiniWaveform speaking={isSpeaking} />
          )
        ) : (
          <Mic size={20} className="text-white/40" />
        )}

        {/* Hover tooltip */}
        {hovering && isDisconnected && (
          <div
            className="absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
            style={{
              background: "rgba(10,10,16,0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            <span className="text-[11px] text-white/60 font-medium">Chat with AI Henry</span>
            {/* Arrow */}
            <div
              className="absolute -bottom-1 right-6 w-2 h-2 rotate-45"
              style={{ background: "rgba(10,10,16,0.9)", borderRight: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            />
          </div>
        )}
      </button>
      <CallSummary />
    </>
  );
}
