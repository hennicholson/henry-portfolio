"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { soundEngine } from "@/lib/sounds";

// Konami: ↑↑↓↓←→←→BA
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function EasterEggs() {
  const [toast, setToast] = useState<string | null>(null);
  const toastRef = useRef<HTMLDivElement>(null);
  const konamiIndex = useRef(0);
  const helloBuffer = useRef("");
  const helloTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedKonami = useRef(false);
  const firedHello = useRef(false);

  useEffect(() => {
    const showToast = (message: string) => {
      setToast(message);
      requestAnimationFrame(() => {
        if (toastRef.current) {
          gsap.fromTo(toastRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
          );
          gsap.to(toastRef.current, {
            y: -10, opacity: 0, duration: 0.3, delay: 3, ease: "power2.in",
            onComplete: () => setToast(null),
          });
        }
      });
    };

    // Party mode listener (triggered from command palette)
    const handleParty = () => {
      triggerPartyMode();
      showToast("You found the cheat code \u{1F3AE}");
    };
    window.addEventListener("party-mode", handleParty);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // --- Konami Code ---
      if (!firedKonami.current) {
        if (e.key === KONAMI[konamiIndex.current]) {
          konamiIndex.current++;
          if (konamiIndex.current === KONAMI.length) {
            firedKonami.current = true;
            konamiIndex.current = 0;
            triggerPartyMode();
            soundEngine.play("party");
            showToast("You found the cheat code \u{1F3AE}");
          }
        } else {
          konamiIndex.current = e.key === KONAMI[0] ? 1 : 0;
        }
      }

      // --- Type "hello" ---
      if (!firedHello.current && e.key.length === 1) {
        helloBuffer.current += e.key.toLowerCase();
        if (helloTimer.current) clearTimeout(helloTimer.current);
        helloTimer.current = setTimeout(() => { helloBuffer.current = ""; }, 2000);

        if (helloBuffer.current.includes("hello")) {
          firedHello.current = true;
          helloBuffer.current = "";
          soundEngine.play("success");
          showToast("Hey! \u{1F44B} Glad you\u2019re curious.");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("party-mode", handleParty);
    };
  }, []);

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div
          ref={toastRef}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-xl"
          style={{
            background: "rgba(10, 10, 16, 0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
            fontFamily: "var(--font-caveat)",
          }}
        >
          <span className="text-white/70 text-base whitespace-nowrap">{toast}</span>
        </div>
      )}
    </>
  );
}

function triggerPartyMode() {
  // Briefly add rainbow gradient animation to all text
  const style = document.createElement("style");
  style.id = "party-mode-style";
  style.textContent = `
    @keyframes party-rainbow {
      0% { color: #ff6b6b; }
      16% { color: #ffd93d; }
      33% { color: #6bcb77; }
      50% { color: #4d96ff; }
      66% { color: #9b59b6; }
      83% { color: #ff6b6b; }
      100% { color: #ffd93d; }
    }
    .party-mode * {
      animation: party-rainbow 0.5s linear infinite !important;
    }
  `;
  document.head.appendChild(style);
  document.body.classList.add("party-mode");

  setTimeout(() => {
    document.body.classList.remove("party-mode");
    style.remove();
  }, 2500);
}
