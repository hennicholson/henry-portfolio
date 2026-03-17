"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Twitter, Linkedin, Github, Mail, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  { label: "Twitter / X", icon: Twitter, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
  { label: "Email", icon: Mail, href: "#" },
];

const nowItems = [
  { emoji: "\u{1F528}", label: "Building", value: "LaunchPad v2" },
  { emoji: "\u270D\uFE0F", label: "Writing", value: "Adventures in AI, Issue 54" },
  { emoji: "\u{1F4CD}", label: "Based in", value: "San Diego, CA" },
];

export function ConnectSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const secretRef = useRef<HTMLDivElement>(null);
  const [secretVisible, setSecretVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const els = sectionRef.current!.querySelectorAll<HTMLElement>("[data-animate]");
      gsap.set(els, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 82%",
        onEnter: () => {
          gsap.to(els, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
        },
        once: true,
      });
    }, sectionRef);

    // Secret footer message
    const handleScroll = () => {
      const atBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 20;
      if (atBottom && !secretVisible) {
        setSecretVisible(true);
        if (secretRef.current) {
          gsap.fromTo(secretRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [secretVisible]);

  return (
    <footer ref={sectionRef} className="relative py-12 md:py-16" data-section="footer">
      <div className="w-[90vw] max-w-3xl mx-auto px-6">
        <div className="text-center mb-10" data-animate>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
            What&apos;s Next?
          </h2>
          <p className="mt-3 text-white/25 text-base max-w-md mx-auto leading-relaxed">
            Always building, always learning.
          </p>
        </div>

        <div className="flex justify-center gap-2.5 mb-12" data-animate>
          {socials.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
            >
              <Icon size={15} className="text-white/30 group-hover:text-white/60 transition-colors duration-300" />
              <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors duration-300 hidden md:inline font-mono tracking-wider">
                {label}
              </span>
              <ArrowUpRight size={10} className="text-white/10 group-hover:text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 hidden md:inline" />
            </a>
          ))}
        </div>

        {/* Now Widget */}
        <div className="flex justify-center mb-12" data-animate>
          <div
            className="rounded-xl px-5 py-4 max-w-sm w-full"
            style={{
              background: "linear-gradient(180deg, rgba(12, 12, 20, 0.6) 0%, rgba(8, 8, 14, 0.7) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/15 block mb-3">
              Right Now
            </span>
            <div className="space-y-2">
              {nowItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-xs">{item.emoji}</span>
                  <span className="text-[10px] font-mono text-white/20 tracking-wider w-14 shrink-0">
                    {item.label}
                  </span>
                  <span className="text-sm text-white/40" style={{ fontFamily: "var(--font-caveat)" }}>
                    {item.value}
                  </span>
                  {i === 0 && (
                    <span className="relative ml-auto flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/20" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white/30" />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-white/[0.04] mb-6" data-animate />

        <p className="text-center text-white/10 text-[10px] tracking-[0.15em] uppercase font-mono mb-4" data-animate>
          &copy; {new Date().getFullYear()} Henry Nicholson
        </p>

        {/* Secret footer message — only appears at absolute scroll bottom */}
        <div
          ref={secretRef}
          className="text-center opacity-0"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          <p className="text-white/[0.12] text-sm">
            You scrolled all the way down? You&apos;re thorough. I like that.
          </p>
        </div>
      </div>
    </footer>
  );
}
