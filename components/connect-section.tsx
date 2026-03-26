"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Twitter, Linkedin, Mail, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  {
    label: "Twitter / X", icon: Twitter, href: "https://x.com/henryfromskinny",
    hoverAnim: (el: HTMLElement) => {
      gsap.to(el, { rotation: -15, duration: 0.15, ease: "power2.out",
        onComplete() { gsap.to(el, { rotation: 15, duration: 0.1, ease: "power2.out",
          onComplete() { gsap.to(el, { rotation: 0, duration: 0.2, ease: "elastic.out(1,0.5)" }); },
        }); },
      });
    },
  },
  {
    label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/henrymnicholson/",
    hoverAnim: (el: HTMLElement) => {
      gsap.to(el, { y: -3, duration: 0.2, ease: "power2.out",
        onComplete() { gsap.to(el, { y: 0, duration: 0.4, ease: "bounce.out" }); },
      });
    },
  },
  {
    label: "Email", icon: Mail, href: "mailto:henrynicholson@sandiego.edu",
    hoverAnim: (el: HTMLElement) => {
      gsap.to(el, { scaleY: 1.2, scaleX: 0.9, duration: 0.15, ease: "power2.out",
        onComplete() { gsap.to(el, { scaleY: 1, scaleX: 1, duration: 0.3, ease: "elastic.out(1,0.4)" }); },
      });
    },
  },
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
          <div
            className="mt-4 inline-block relative"
            data-animate
            style={{
              fontFamily: "var(--font-caveat)",
              fontSize: "16px",
              color: "rgba(255,255,255,0.18)",
              transform: "rotate(-2deg)",
            }}
          >
            seriously, DM me &mdash; I respond fast
            <svg
              width="50"
              height="24"
              viewBox="0 0 50 24"
              className="absolute -bottom-5 left-1/2 -translate-x-1/2"
              style={{ transform: "translateX(-50%) rotate(2deg)" }}
            >
              <path
                d="M10 2 C 20 2, 35 6, 40 18"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="3 3"
              />
              <path
                d="M37 13 L40 19 L34 17"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1.2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex justify-center gap-2.5 mb-12" data-animate>
          {socials.map(({ label, icon: Icon, href, hoverAnim }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              data-magnetic
              className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              onMouseEnter={(e) => {
                const icon = e.currentTarget.querySelector("[data-social-icon]") as HTMLElement;
                if (icon) hoverAnim(icon);
              }}
            >
              <Icon data-social-icon size={15} className="text-white/30 group-hover:text-white/60 transition-colors duration-300" />
              <span className="text-[10px] text-white/30 group-hover:text-white/50 transition-colors duration-300 hidden md:inline font-mono tracking-wider">
                {label}
              </span>
              <ArrowUpRight size={10} className="text-white/10 group-hover:text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 hidden md:inline" />
            </a>
          ))}
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
