"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { soundEngine } from "@/lib/sounds";
import "./newsletter-envelope.css";

/* Edit these per issue. */
export const ISSUE = {
  number: "014",
  date: "Sept 7, 2026",
  greeting: "Hey,",
  body: [
    "This week I rebuilt an agent that kept hallucinating file paths. The fix wasn't a better model. It was giving it less context, not more.",
    "Below: the three-layer context pattern I landed on, the prompt that finally made it stop guessing, and why your system prompt is probably doing too much.",
    "Takes about four minutes. Reply and tell me what broke for you this week. I read every one.",
  ],
  signoff: "Henry",
};

type Props = {
  /** letter pulled out and resting on top of the envelope */
  open: boolean;
  /** bump to play the "sealed" stamp (after a subscribe) */
  stamp: number;
  /** touch: tap toggles, since there is no hover */
  onTap?: () => void;
};

export function NewsletterEnvelope({ open, stamp, onTap }: Props) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(open);

  /* The pull-out timeline. Distances come from measured sizes, so it is
     rebuilt on resize and scrubbed back to the current state. */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const q = gsap.utils.selector(scene);

    const build = () => {
      tlRef.current?.kill();
      const env = q(".nle-env")[0] as HTMLElement | undefined;
      const letter = q(".nle-letter")[0] as HTMLElement | undefined;
      const inside = q(".nle-inside")[0] as HTMLElement | undefined;
      const flap = q(".nle-flap")[0] as HTMLElement | undefined;
      const seal = q(".nle-seal")[0] as HTMLElement | undefined;
      if (!env || !letter || !inside || !flap || !seal) return;

      gsap.set([letter, inside, flap, seal], { clearProps: "all" });

      const envHeight = env.offsetHeight;
      const insideScale = 0.76;
      const insideTop = envHeight * 0.12;
      const clearedY = -(letter.offsetHeight * insideScale + insideTop + 12);
      const restingY = -(env.offsetTop + insideTop);

      gsap.set(letter, { scale: insideScale, transformOrigin: "50% 0%" });

      const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" } });
      tl.to(seal, { opacity: 0, scale: 0.6, duration: 0.25 }, 0)
        .to(flap, { rotateX: -180, duration: 0.7 }, 0.15)
        .set(flap, { zIndex: 0 }, 0.5)
        .to(letter, { y: clearedY, duration: 0.8 }, 0.5)
        /* the letter has cleared the pocket: stop clipping, come to the front */
        .set(inside, { clipPath: "none", zIndex: 4 }, 1.3)
        .to(flap, { opacity: 0, duration: 0.3 }, 1.3)
        .to(
          letter,
          { y: restingY, x: 8, scale: 1, rotation: 6, duration: 0.9, ease: "power3.out" },
          1.3,
        )
        .to(env, { boxShadow: "0 40px 90px -30px rgba(0, 0, 0, 0.95)", duration: 0.6 }, 1.3);

      tl.progress(openRef.current ? 1 : 0);
      tlRef.current = tl;
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(scene);
    return () => {
      ro.disconnect();
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, []);

  useEffect(() => {
    openRef.current = open;
    const tl = tlRef.current;
    if (!tl) return;
    if (open) {
      soundEngine.play("whooshUp");
      tl.play();
    } else {
      tl.reverse();
    }
  }, [open]);

  /* Subscribe: the letter goes back in, the flap closes, the seal stamps down. */
  useEffect(() => {
    if (!stamp) return;
    const tl = tlRef.current;
    const scene = sceneRef.current;
    if (!tl || !scene) return;
    const seal = scene.querySelector<HTMLElement>(".nle-seal");
    const env = scene.querySelector<HTMLElement>(".nle-env");
    if (!seal || !env) return;

    const press = () => {
      soundEngine.play("chime");
      gsap.fromTo(
        seal,
        { opacity: 0, scale: 1.9, rotation: -12 },
        { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: "back.out(2)" },
      );
      gsap.fromTo(
        env,
        { scale: 1 },
        { scale: 0.985, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut", delay: 0.22 },
      );
    };

    if (tl.progress() > 0) {
      tl.reverse();
      gsap.delayedCall(tl.time() / tl.timeScale() + 0.05, press);
    } else {
      press();
    }
  }, [stamp]);

  return (
    <div
      ref={sceneRef}
      className="nle"
      data-open={open}
      tabIndex={0}
      role="button"
      aria-expanded={open}
      aria-label="Peek inside the latest issue"
      onPointerUp={(event) => {
        if (event.pointerType === "touch") onTap?.();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onTap?.();
        }
      }}
    >
      <div className="nle-env">
        <div className="nle-back" />

        <div className="nle-inside">
          <article className="nle-letter" aria-hidden={!open}>
            <header className="nle-letter-head">
              <span>Context Engineering · Issue {ISSUE.number}</span>
              <span className="nle-letter-date">{ISSUE.date}</span>
            </header>
            <p className="nle-letter-hi">{ISSUE.greeting}</p>
            {ISSUE.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="nle-letter-sign">{ISSUE.signoff}</p>
            <footer className="nle-letter-foot">Free · Weekly · No spam</footer>
          </article>
        </div>

        <div className="nle-pocket">
          <svg className="nle-seams" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 100 L50 52 L100 100" />
            <path d="M0 0 L50 52 L100 0" />
          </svg>
          <span className="nle-stamp">{ISSUE.date.toUpperCase()}</span>
          <span className="nle-badges">Free · Weekly · No spam</span>
        </div>

        <div className="nle-flap">
          <span className="nle-flap-label">Context Engineering</span>
          <span className="nle-flap-issue">Issue {ISSUE.number}</span>
        </div>

        <div className="nle-seal" aria-hidden="true">
          <svg viewBox="0 0 128 64">
            <path d="M15 8 V56" />
            <path d="M15 32 H47" />
            <path d="M47 8 V56" />
            <path d="M69 56 V8" />
            <path d="M69 8 L113 56" />
            <path d="M113 56 V8" />
          </svg>
        </div>
      </div>
    </div>
  );
}
