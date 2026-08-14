"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pause every <video> under `root` while it is off screen, resume when it
 * returns. Looping decorative videos otherwise keep decoding for the whole
 * session no matter where the visitor actually is on the page.
 */
export function useVideoVisibility(root: RefObject<Element | null>) {
  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        el.querySelectorAll("video").forEach((video) => {
          if (visible) {
            // only resume what autoplays — never force-play user-controlled media
            if (video.autoplay) video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin: "80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [root]);
}
