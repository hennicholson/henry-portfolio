"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

export function ParallaxHero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Sync Lenis smooth scroll with GSAP ScrollTrigger
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    const triggerElement = parallaxRef.current?.querySelector(
      "[data-parallax-layers]"
    );
    if (!triggerElement) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: "0% 0%",
        end: "100% 0%",
        scrub: 0,
      },
    });

    const layers = [
      { layer: "1", yPercent: 70 }, // Background — moves down most, appears to stay in place
      { layer: "2", yPercent: 55 }, // Gradient overlay
      { layer: "3", yPercent: 40 }, // Text — middle speed
      { layer: "4", yPercent: 10 }, // Foreground — barely moves, scrolls away fastest
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

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf(triggerElement);
    };
  }, []);

  return (
    <div ref={parallaxRef}>
      <section className="parallax__header">
        <div className="parallax__visuals">
          <div data-parallax-layers className="parallax__layers">
            {/* Layer 1: Background cityscape — stays most in place */}
            <img
              src="/hero-bg.webp"
              loading="eager"
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img md:!hidden"
            />
            <img
              src="/hero-bg-desktop.webp"
              loading="eager"
              data-parallax-layer="1"
              alt=""
              className="parallax__layer-img !hidden md:!block"
            />

            {/* Layer 2: Gradient for text readability */}
            <div
              data-parallax-layer="2"
              className="parallax__layer-img parallax__layer-gradient"
            />

            {/* Layer 3: Text — between background and foreground */}
            <div data-parallax-layer="3" className="parallax__layer-title">
              <h1
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter text-center leading-[0.9]"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.4)" }}
              >
                Henry
                <br />
                Nicholson
              </h1>
              <p
                className="mt-6 text-sm sm:text-base md:text-lg text-white/70 font-light tracking-[0.3em] uppercase"
                style={{ textShadow: "0 2px 15px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3)" }}
              >
                Builder & Entrepreneur
              </p>
            </div>

            {/* Layer 4: Foreground person — scrolls away fastest */}
            <img
              src="/hero-fg.webp"
              loading="eager"
              data-parallax-layer="4"
              alt=""
              className="parallax__layer-img md:!hidden"
            />
            <img
              src="/hero-fg-desktop.webp"
              loading="eager"
              data-parallax-layer="4"
              alt=""
              className="parallax__layer-img !hidden md:!block"
            />

            {/* Layer 3 (ghost): X-ray text visible through the person */}
            <div data-parallax-layer="3" className="parallax__layer-title parallax__layer-title--ghost">
              <h1
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter text-center leading-[0.9]"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.6), 0 0 60px rgba(0,0,0,0.4)" }}
              >
                Henry
                <br />
                Nicholson
              </h1>
              <p
                className="mt-6 text-sm sm:text-base md:text-lg text-white/70 font-light tracking-[0.3em] uppercase"
                style={{ textShadow: "0 2px 15px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.3)" }}
              >
                Builder & Entrepreneur
              </p>
            </div>
          </div>
          <div className="parallax__fade" />
        </div>
      </section>
    </div>
  );
}
