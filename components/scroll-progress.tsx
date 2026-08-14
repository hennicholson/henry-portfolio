"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { soundEngine } from "@/lib/sounds";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const chapters = [
  { id: "hero", label: "Intro", num: "01" },
  { id: "story", label: "Story", num: "02" },
  { id: "journey", label: "Journey", num: "03" },
  { id: "stack", label: "Stack", num: "04" },
  { id: "projects", label: "Work", num: "05" },
  { id: "proof", label: "Proof", num: "06" },
  { id: "footer", label: "Connect", num: "07" },
];

export function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      gsap.set(containerRef.current, { opacity: 0, x: 20 });
      gsap.to(containerRef.current, { opacity: 1, x: 0, duration: 0.8, delay: 1.8, ease: "power3.out" });
    }

    const progressTrigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        if (fillRef.current) gsap.set(fillRef.current, { scaleY: self.progress });
      },
    });

    const sectionTriggers: ScrollTrigger[] = [];
    chapters.forEach((chapter, i) => {
      const el = document.querySelector(`[data-section="${chapter.id}"]`);
      if (!el) return;
      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveChapter(i),
        onEnterBack: () => setActiveChapter(i),
      });
      sectionTriggers.push(trigger);
    });

    return () => {
      progressTrigger.kill();
      sectionTriggers.forEach((t) => t.kill());
    };
  }, []);

  const prevChapter = useRef(0);

  // Animate dots and labels on chapter change
  useEffect(() => {
    soundEngine.playThrottled("sectionEnter", 800);
    // Celebrate the chapter we just left
    if (activeChapter > prevChapter.current) {
      const completedDot = dotRefs.current[prevChapter.current];
      if (completedDot) {
        gsap.to(completedDot, {
          boxShadow: "0 0 8px 2px rgba(74,222,128,0.5)",
          duration: 0.2,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(completedDot, {
              boxShadow: "0 0 0px 0px rgba(74,222,128,0)",
              duration: 0.6,
              ease: "power2.out",
            });
          },
        });
      }
    }
    prevChapter.current = activeChapter;

    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      const isActive = i === activeChapter;
      const isPast = i < activeChapter;

      gsap.to(dot, {
        scale: isActive ? 1.8 : 1,
        duration: 0.4,
        ease: "elastic.out(1, 0.6)",
      });
      gsap.to(dot, {
        backgroundColor: isActive ? "#fff" : isPast ? "rgba(255,255,255,0.5)" : "transparent",
        borderColor: isActive ? "rgba(255,255,255,0.8)" : isPast ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.1)",
        duration: 0.3,
        ease: "power2.out",
      });
    });

    labelRefs.current.forEach((label, i) => {
      if (!label) return;
      gsap.to(label, {
        opacity: i === activeChapter ? 1 : 0,
        x: i === activeChapter ? 0 : 8,
        duration: 0.4,
        ease: "power3.out",
      });
    });
  }, [activeChapter]);

  const scrollTo = useCallback((id: string, index: number) => {
    soundEngine.play("click");
    if (index === 0) {
      gsap.to(window, { scrollTo: { y: 0 }, duration: 1.2, ease: "power3.inOut" });
      return;
    }
    const el = document.querySelector(`[data-section="${id}"]`);
    if (el) gsap.to(window, { scrollTo: { y: el, offsetY: 80 }, duration: 1.2, ease: "power3.inOut" });
  }, []);

  return (
    <div ref={containerRef} className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-0">
      <div className="relative flex flex-col items-center">
        {/* Track */}
        <div className="relative w-px h-64" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div
            ref={fillRef}
            className="absolute top-0 left-0 w-full h-full origin-top"
            style={{ background: "rgba(255,255,255,0.25)", transform: "scaleY(0)" }}
          />

          {chapters.map((chapter, i) => (
            <div
              key={chapter.id}
              className="absolute left-1/2 -translate-x-1/2 flex items-center"
              style={{ top: `${(i / (chapters.length - 1)) * 100}%` }}
            >
              {/* Label + number — positioned to the left */}
              <div
                ref={(el) => { labelRefs.current[i] = el; }}
                className="absolute right-5 flex items-center gap-2 opacity-0"
              >
                <span className="text-[9px] font-mono tracking-widest text-white/20">
                  {chapter.num}
                </span>
                <span className="text-[10px] font-mono tracking-wider uppercase text-white/50 whitespace-nowrap">
                  {chapter.label}
                </span>
              </div>

              {/* Dot */}
              <button
                ref={(el) => { dotRefs.current[i] = el; }}
                onClick={() => scrollTo(chapter.id, i)}
                className="w-[7px] h-[7px] rounded-full cursor-pointer relative"
                style={{
                  border: "1px solid rgba(255,255,255,0.1)",
                  backgroundColor: "transparent",
                }}
                aria-label={i === 0 ? "Back to top" : `Scroll to ${chapter.label}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
