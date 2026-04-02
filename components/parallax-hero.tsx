"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxHero() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ghostH1Ref = useRef<HTMLHeadingElement>(null);
  const ghostSubtitleRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const introH1Ref = useRef<HTMLHeadingElement>(null);
  const introSubRef = useRef<HTMLParagraphElement>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scattered = useRef(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const handleNameHold = useCallback(() => {
    holdTimer.current = setTimeout(() => {
      if (scattered.current || !h1Ref.current) return;
      scattered.current = true;

      const letters = h1Ref.current.querySelectorAll<HTMLElement>("[data-letter]");
      letters.forEach((el) => {
        gsap.to(el, {
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 80,
          rotation: (Math.random() - 0.5) * 60,
          duration: 0.6,
          ease: "power3.out",
        });
      });

      setTimeout(() => {
        letters.forEach((el) => {
          gsap.to(el, {
            x: 0, y: 0, rotation: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.4)",
          });
        });
        scattered.current = false;
      }, 1200);
    }, 2000);
  }, []);

  const handleNameRelease = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const triggerElement = parallaxRef.current?.querySelector(
      "[data-parallax-layers]"
    );
    if (!triggerElement) return;

    const skipIntro = sessionStorage.getItem("intro-played") === "1"
      || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (skipIntro) {
      // Show everything immediately
      [h1Ref.current, subtitleRef.current, ghostH1Ref.current, ghostSubtitleRef.current].forEach((el) => {
        if (el) gsap.set(el, { opacity: 1 });
      });
      if (scrollRef.current) gsap.set(scrollRef.current, { opacity: 1 });
      setShowOverlay(false);
    } else {
      // Lock scroll during intro
      document.body.style.overflow = "hidden";

      // Hide the real hero text — the overlay copy will be visible
      [h1Ref.current, subtitleRef.current, ghostH1Ref.current, ghostSubtitleRef.current].forEach((el) => {
        if (el) gsap.set(el, { opacity: 0 });
      });

      const introTL = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          sessionStorage.setItem("intro-played", "1");
          document.body.style.overflow = "";
        },
      });

      // Phase 1: Fade in the intro text on the overlay (starts big & centered)
      if (introH1Ref.current) {
        introTL.fromTo(introH1Ref.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          0
        );
      }
      if (introSubRef.current) {
        introTL.fromTo(introSubRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.3
        );
      }

      // Phase 2: Hold for a beat, then zoom out
      // Calculate scale ratio: intro text is scale(1.3), hero text is scale(1)
      // The overlay text will scale down + the overlay bg fades out to reveal the hero behind it
      introTL.to(overlayRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
      }, 1.4);

      // Scale & move the intro text container to match hero position
      const introTextContainer = overlayRef.current?.querySelector("[data-intro-text]");
      if (introTextContainer) {
        introTL.to(introTextContainer, {
          scale: 1 / 1.3, // zoom out from 1.3x to 1x
          duration: 0.8,
          ease: "power2.inOut",
        }, 1.4);
      }

      // Simultaneously reveal the real hero text
      introTL.to([h1Ref.current, subtitleRef.current].filter(Boolean), {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }, 1.8);

      introTL.to([ghostH1Ref.current, ghostSubtitleRef.current].filter(Boolean), {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, 1.8);

      // Remove overlay from DOM
      introTL.call(() => setShowOverlay(false), [], 2.2);

      // Scroll indicator fades in
      if (scrollRef.current) {
        introTL.fromTo(scrollRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          2.0
        );
      }
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: true,
      },
    });

    const layers = [
      { layer: "1", yPercent: 70 },
      { layer: "2", yPercent: 55 },
      { layer: "3", yPercent: 40 },
      { layer: "4", yPercent: 10 },
    ];

    layers.forEach((layerObj, idx) => {
      tl.to(
        triggerElement.querySelectorAll(
          `[data-parallax-layer="${layerObj.layer}"]`
        ),
        { yPercent: layerObj.yPercent, ease: "none" },
        idx === 0 ? undefined : "<"
      );
    });

    // Fade out scroll indicator on scroll
    if (scrollRef.current) {
      gsap.to(scrollRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: triggerElement,
          start: "2% 0%",
          end: "10% 0%",
          scrub: true,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(triggerElement);
    };
  }, []);

  const wrapLetters = (text: string) =>
    text.split("").map((char, i) => (
      <span key={i} data-letter className="inline-block">
        {char}
      </span>
    ));

  const textContent = (
    h1RefProp: React.Ref<HTMLHeadingElement>,
    subtitleRefProp: React.Ref<HTMLParagraphElement>,
    isMain?: boolean,
  ) => (
    <>
      <h1
        ref={h1RefProp}
        className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter text-center leading-[0.9] select-none"
        style={{
          textShadow: "0 2px 20px rgba(0, 0, 0, 0.6)",
          opacity: 0,
        }}
        onMouseDown={isMain ? handleNameHold : undefined}
        onMouseUp={isMain ? handleNameRelease : undefined}
        onMouseLeave={isMain ? handleNameRelease : undefined}
        onTouchStart={isMain ? handleNameHold : undefined}
        onTouchEnd={isMain ? handleNameRelease : undefined}
      >
        {isMain ? wrapLetters("Henry") : "Henry"}
        <br />
        {isMain ? wrapLetters("Nicholson") : "Nicholson"}
      </h1>
      <p
        ref={subtitleRefProp}
        className="mt-6 text-sm sm:text-base md:text-lg text-white/55 font-light tracking-[0.35em] uppercase"
        style={{
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
          opacity: 0,
        }}
      >
        Builder & Entrepreneur
      </p>
    </>
  );

  return (
    <div ref={parallaxRef}>
      {/* Intro overlay — text pops up big, then zooms out into the hero */}
      {showOverlay && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backgroundColor: "#050508",
            animation: "intro-overlay-fallback 0.6s ease-out 5s forwards",
          }}
        >
          <div data-intro-text className="flex flex-col items-center" style={{ transform: "scale(1.3)" }}>
            <h1
              ref={introH1Ref}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter text-center leading-[0.9] select-none"
              style={{
                textShadow: "0 2px 20px rgba(0, 0, 0, 0.6)",
                opacity: 0,
              }}
            >
              Henry<br />Nicholson
            </h1>
            <p
              ref={introSubRef}
              className="mt-6 text-sm sm:text-base md:text-lg text-white/55 font-light tracking-[0.35em] uppercase"
              style={{
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
                opacity: 0,
              }}
            >
              Builder & Entrepreneur
            </p>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes intro-overlay-fallback {
          to { opacity: 0; pointer-events: none; }
        }
      `}</style>
      <section className="parallax__header" data-section="hero">
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
            {/* Layer 1: Background */}
            <img
              src="/hero-bg.webp"
              loading="eager"
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img parallax__layer-hw md:!hidden"
            />
            <video
              src="/hero-bg-video.mp4"
              autoPlay
              muted
              loop
              playsInline
              data-parallax-layer="1"
              className="parallax__layer-img parallax__layer-hw !hidden md:!block"
            />

            {/* Layer 2: Gradient */}
            <div
              data-parallax-layer="2"
              className="parallax__layer-img parallax__layer-gradient parallax__layer-hw"
            />

            {/* Layer 3: Text */}
            <div data-parallax-layer="3" className="parallax__layer-title parallax__layer-hw">
              {textContent(h1Ref, subtitleRef, true)}
            </div>

            {/* Layer 4: Foreground (mobile: single image, desktop: ridge + figure) */}
            <img
              src="/hero-fg.webp"
              loading="eager"
              data-parallax-layer="4"
              alt=""
              className="parallax__layer-img parallax__layer-hw md:!hidden"
            />
            <div
              data-parallax-layer="4"
              className="parallax__layer-img parallax__layer-hw !hidden md:!block"
            >
              <img
                src="/hero-ridge-desktop.webp"
                loading="eager"
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
              <video
                src="/hero-figure.webm"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                style={{ top: "3px" }}
              />
            </div>

            {/* Layer 3 (ghost): X-ray text */}
            <div data-parallax-layer="3" className="parallax__layer-title parallax__layer-title--ghost parallax__layer-hw">
              {textContent(ghostH1Ref, ghostSubtitleRef)}
            </div>
          </div>
          <div className="parallax__fade" />
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-[1px] h-8"
              style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.3))" }}
            />
            <div className="animate-bounce">
              <ChevronDown size={16} className="text-white/40" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
