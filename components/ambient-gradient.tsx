"use client";

/*
 * Static by design. This used to run an infinite GSAP tween on
 * background-position — a full-viewport repaint every frame, forever, to
 * drift gradients at 2–3% alpha that no one can consciously see. The paint
 * budget went to the least visible element on the page. The gradients stay;
 * the tween goes.
 */
export function AmbientGradient() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 20% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 60%),
          radial-gradient(ellipse 60% 80% at 80% 20%, rgba(59, 130, 246, 0.02) 0%, transparent 50%)
        `,
      }}
    />
  );
}
