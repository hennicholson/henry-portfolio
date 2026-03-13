"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const lines = [
  "I\u2019ve been building things on the",
  "internet since I was 13. From my first",
  "online venture to creating SaaS products,",
  "every step has been fueled by",
  "curiosity and a love for creating.",
];

export function IntroText() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      lineRefs.current.forEach((line, i) => {
        if (!line) return;
        gsap.from(line, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 md:py-40">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="text-lg md:text-xl text-white/50 leading-relaxed font-light">
          {lines.map((line, i) => (
            <span
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="inline-block"
              style={{ marginRight: "0.3em" }}
            >
              {line}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
