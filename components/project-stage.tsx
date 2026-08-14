"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowUpRight,
  Calculator,
  Clapperboard,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Globe,
  Hexagon,
  Mail,
  Maximize2,
  Car,
  Palette,
  Pause,
  Volume2,
  VolumeX,
  Play,
  Rocket,
  Shirt,
  Sparkles,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { soundEngine } from "@/lib/sounds";
import type { ProjectData } from "@/components/project-gallery";
import "./project-stage.css";

/**
 * Hosts whose frame-ancestors / X-Frame-Options policy excludes
 * henrynicholson.dev. These render as poster + "open live" rather than a frame
 * that would look fine locally and silently fail in production.
 *
 * Empty today: vibechckd.cc used to sit here because its CSP allowed localhost
 * but not this domain. That is fixed at the source in vibecheck/next.config.ts
 * — which only takes effect once vibechckd is redeployed.
 */
const FRAME_BLOCKED_HOSTS = new Set<string>([]);

/**
 * A quiet per-project mark in the card corner. Keyed by slug — swap any of
 * these for a different Lucide icon, or add a slug when a project is added.
 * Anything unlisted falls back to a globe.
 */
const PROJECT_ICONS: Record<string, LucideIcon> = {
  "skinny-studio": Sparkles,
  launchpad: Rocket,
  "forefront-usd": GraduationCap,
  vibechckd: Palette,
  "adventures-in-ai": Mail,
  "ai-video-production": Clapperboard,
  "Zenvra-Calculator": Calculator,
  Sevasxyz: Hexagon,
  "topline-vip": Car,
  "eight-day-weeks": Shirt,
};

/** Width the frame is rendered at before being scaled down to fit the stage. */
const FRAME_WIDTH = 1280;

/**
 * Projects whose "preview" is a film rather than a running site. Keyed by slug,
 * same as the icons — add a slug here and the stage plays it instead of framing
 * a URL. Autoplays muted (the only kind browsers allow inline); the meta column
 * carries a sound toggle.
 */
const PROJECT_VIDEOS: Record<string, string> = {
  "ai-video-production": "/ai-video-production.mp4",
};

/**
 * Copy points for projects that are a family rather than a single product.
 * Rendered in place of the prose description so the column keeps one height —
 * a taller meta block on one project is what used to shove the page around.
 */
const PROJECT_POINTS: Record<string, string[]> = {
  "skinny-studio": [
    "Skinny Creative Agency",
    "Skinny.studio — AI creative platform",
    "Skinny OS — internal operating system",
  ],
};

/** Quiet stretch before the section starts moving on its own. Long enough
 *  that browsing the gallery doesn't get interrupted mid-scroll. */
const IDLE_MS = 9000;

/** Slides kept live around the selected one; the rest stay as stills.
 *  Radius 1 = at most three running sites in the strip. Radius 2 meant five
 *  full websites executing simultaneously, which is where the lag lived. */
const LIVE_RADIUS = 1;

/** How long before we admit the preview is taking a while. Never a kill-timer. */
const SLOW_AFTER_MS = 8000;

type FrameState = "idle" | "loading" | "live" | "slow" | "blocked";

function previewTarget(project: ProjectData): string | null {
  const raw = project.previewUrl || project.url;
  if (!raw || raw === "#") return null;
  return raw;
}

function isFrameable(project: ProjectData): boolean {
  const target = previewTarget(project);
  if (!target || !project.iframeable) return false;
  try {
    return !FRAME_BLOCKED_HOSTS.has(new URL(target).hostname);
  } catch {
    return false;
  }
}

function displayHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

const STATUS_LABEL: Record<FrameState, string> = {
  idle: "Live preview",
  loading: "Loading",
  live: "Live",
  slow: "Still loading",
  blocked: "Preview unavailable",
};

/* Browser state read as external stores — subscribing this way keeps the
   values out of effect bodies, which would otherwise cascade renders. */
const reducedMotion = {
  subscribe(onChange: () => void) {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  },
  get: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  server: () => false,
};

const pageHidden = {
  subscribe(onChange: () => void) {
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  },
  get: () => document.hidden,
  server: () => false,
};

export interface ProjectStageProps {
  projects: ProjectData[];
}

export function ProjectStage({ projects }: ProjectStageProps) {
  const baseId = useId();
  const sectionRef = useRef<HTMLElement | null>(null);
  const frameBoxRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [selected, setSelected] = useState(0);
  const [armed, setArmed] = useState(false);
  /* Both track a URL rather than a boolean, so switching projects invalidates
     them without an effect having to reset anything. */
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [slowSrc, setSlowSrc] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  /* "on" rotates, "paused" holds the bar mid-fill (hover / focus / hidden tab /
     scrolled away), "off" retires it — either the visitor took control or they
     asked for reduced motion. */
  const [autoplay, setAutoplay] = useState<"on" | "off">("on");
  const [hovering, setHovering] = useState(false);
  /* Rotation waits for quiet rather than stopping for good: any interaction
     defers it by IDLE_MS, and it picks back up once the visitor settles. */
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deferAutoplay = useCallback(() => {
    setIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS);
  }, []);

  useEffect(() => {
    idleTimer.current = setTimeout(() => setIdle(true), IDLE_MS);
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  const finePointer = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false,
  );

  const prefersReducedMotion = useSyncExternalStore(
    reducedMotion.subscribe,
    reducedMotion.get,
    reducedMotion.server,
  );
  const tabHidden = useSyncExternalStore(pageHidden.subscribe, pageHidden.get, pageHidden.server);

  const active = projects[selected];
  const target = active ? previewTarget(active) : null;
  const videoSrc = active ? PROJECT_VIDEOS[active.id] : undefined;
  const points = active ? PROJECT_POINTS[active.id] : undefined;
  /* a film supersedes a site preview — it IS the work */
  const frameable = !videoSrc && active ? isFrameable(active) : false;
  const [muted, setMuted] = useState(true);
  const stageVideoRef = useRef<HTMLVideoElement | null>(null);

  /* ── Scale the frame to whatever width the stage happens to be ──────── */
  useEffect(() => {
    const box = frameBoxRef.current;
    if (!box) return;

    box.style.setProperty("--pj-frame-w", String(FRAME_WIDTH));

    const apply = (width: number) => {
      box.style.setProperty("--pj-stage-w", String(Math.round(width)));
    };

    apply(box.getBoundingClientRect().width);

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) apply(entry.contentRect.width);
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  /* ── Only reach for the network once the section is actually near ───── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || armed) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  /* Don't rotate a section nobody is looking at — it would burn network on
     iframe reloads and the visitor would come back mid-sequence. */
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries.some((e) => e.isIntersecting)),
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ── "Taking a while" hint. Deliberately NOT a kill-timer: the frame is
        still free to land afterwards, which is what the old 5s abort got
        wrong — it permanently downgraded previews that simply loaded slowly. */
  useEffect(() => {
    if (!armed || !frameable || !target) return;
    const timer = setTimeout(() => setSlowSrc(target), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [armed, frameable, target]);

  /* React does not always reflect `muted` onto the element before the first
     play attempt, and a muted autoplay that loses the race just stays paused.
     Set it imperatively and nudge — same insurance the hero video carries. */
  useEffect(() => {
    const video = stageVideoRef.current;
    if (!video || !videoSrc) return;
    video.muted = muted;
    if (!inView) {
      video.pause();
      return;
    }
    const play = () => {
      video.play().catch(() => {
        /* blocked — the poster stands in */
      });
    };
    play();
    video.addEventListener("loadeddata", play);
    return () => video.removeEventListener("loadeddata", play);
  }, [videoSrc, muted, inView]);

  /* ── Native dialog needs imperative open/close ──────────────────────── */
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (dialogOpen && !dialog.open) dialog.showModal();
    if (!dialogOpen && dialog.open) dialog.close();
  }, [dialogOpen]);

  /* Mirrors `selected` synchronously. A held arrow key fires faster than React
     re-renders, so reading state directly would make every repeat compute from
     the same stale index and advance only one step. */
  const selectedRef = useRef(0);

  /* Embedded pages steal scroll. A cross-origin iframe that autofocuses an
     input — a loan calculator, a search box — makes the browser scroll it into
     view and drags the page with it. We can't reach into that document, so we
     hold the page still through the switch and yield the instant the visitor
     scrolls for themselves. */
  const holdScroll = useCallback(() => {
    const y = window.scrollY;
    let holding = true;

    const correct = () => {
      if (!holding) return;
      if (Math.abs(window.scrollY - y) > 2) window.scrollTo({ top: y });
    };
    const release = () => {
      holding = false;
      clearTimeout(timer);
      window.removeEventListener("scroll", correct);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };

    window.addEventListener("scroll", correct, { passive: true });
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("keydown", release);
    const timer = setTimeout(release, 1400);
  }, []);

  const select = useCallback(
    (index: number, opts: { focus?: boolean; manual?: boolean } = {}) => {
      const count = projects.length;
      const next = ((index % count) + count) % count;
      if (next === selectedRef.current) return;
      selectedRef.current = next;
      holdScroll();
      setSelected(next);
      soundEngine.play("click");
      if (opts.manual) deferAutoplay();
      if (opts.focus) {
        const tab = tabRefs.current[next];
        // preventScroll — selecting a tab must never yank the page (gate 53)
        tab?.focus({ preventScroll: true });
      }
    },
    [projects.length, deferAutoplay, holdScroll],
  );

  /* ── Swipe the stage on touch ───────────────────────────────────────── */
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = useCallback((event: React.TouchEvent) => {
    const t = event.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (event: React.TouchEvent) => {
      const start = touchStart.current;
      touchStart.current = null;
      if (!start) return;
      const t = event.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      // horizontal intent only — never hijack a vertical page scroll
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      select(selectedRef.current + (dx < 0 ? 1 : -1), { manual: true });
    },
    [select],
  );

  /* Pointer drag. Native overflow already gives touch and trackpad momentum;
     this adds the same feel for a mouse by moving scrollLeft directly. A drag
     past a few pixels suppresses the click so you don't select what you were
     only sliding past. */
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: 0 });
  const [dragging, setDragging] = useState(false);

  const onRailPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return; // native touch scrolling is better
    const rail = railRef.current;
    if (!rail) return;
    drag.current = {
      down: true,
      startX: event.clientX,
      startScroll: rail.scrollLeft,
      moved: 0,
    };
    setDragging(true);
  }, []);

  const onRailPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail || !drag.current.down) return;
    const dx = event.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    rail.scrollLeft = drag.current.startScroll - dx;
  }, []);

  const endDrag = useCallback(() => {
    if (!drag.current.down) return;
    drag.current.down = false;
    setDragging(false);
    deferAutoplay();
  }, [deferAutoplay]);

  /* Bring the chosen slide into view — but only when it isn't already there.
     Re-centring on every tick meant autoplay kept hauling the strip sideways
     while you were trying to read it. */
  useEffect(() => {
    const rail = railRef.current;
    const slide = tabRefs.current[selected];
    if (!rail || !slide) return;

    const left = slide.offsetLeft - rail.scrollLeft;
    const right = left + slide.clientWidth;
    if (left >= 0 && right <= rail.clientWidth) return;

    const target = slide.offsetLeft - (rail.clientWidth - slide.clientWidth) / 2;
    rail.scrollTo({
      left: Math.max(0, target),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [selected, prefersReducedMotion]);

  const onRailKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") return select(0, { focus: true, manual: true });
      if (event.key === "End") return select(projects.length - 1, { focus: true, manual: true });
      const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1;
      select(selectedRef.current + delta, { focus: true, manual: true });
    },
    [select, projects.length],
  );

  const frameState: FrameState = videoSrc
    ? loadedSrc === videoSrc
      ? "live"
      : "loading"
    : !frameable
      ? "blocked"
    : !armed
      ? "idle"
      : loadedSrc === target
        ? "live"
        : slowSrc === target
          ? "slow"
          : "loading";

  const posterHidden = frameState === "live";

  const tagList = useMemo(() => active?.tags?.slice(0, 5) ?? [], [active]);

  if (!active) return null;

  const autoplayOn = autoplay === "on" && !prefersReducedMotion && projects.length > 1;
  const rotating = autoplayOn && idle && inView && !hovering && !tabHidden;
  const autoplayState = !autoplayOn ? "off" : rotating ? "on" : "paused";

  return (
    <section
      ref={sectionRef}
      className="pj"
      data-section="projects"
      data-autoplay={autoplayState}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHovering(false);
        }
      }}
    >
      <div className="pj__wrap">
        <div className="pj__head">
          <h2 className="pj__title">What I&apos;m Building</h2>
          <p className="pj__lede">
            Products, platforms, and experiments at the intersection of AI, marketing, and
            design. Each one runs live below.
          </p>
        </div>

        <div className="pj__shell">
          {/* ── Identity + spec. Every control lives here, so nothing floats
                over the embedded site. ─────────────────────────────────── */}
          <div className="pj__meta">
            <div className="pj__numrow">
              <button
                type="button"
                className="pj__arrow"
                onClick={() => select(selectedRef.current - 1, { manual: true })}
                aria-label="Previous project"
              >
                <ChevronLeft size={15} aria-hidden="true" />
              </button>
              <span className="pj__num">
                {String(selected + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
              </span>
              <button
                type="button"
                className="pj__arrow"
                onClick={() => select(selectedRef.current + 1, { manual: true })}
                aria-label="Next project"
              >
                <ChevronRight size={15} aria-hidden="true" />
              </button>
            </div>
            <h3 className="pj__name">{active.title}</h3>
            {active.subtitle && <p className="pj__sub">{active.subtitle}</p>}
            {points ? (
              <ul className="pj__points">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            ) : (
              <p className="pj__desc">{active.description}</p>
            )}

            <dl className="pj__spec">
              <dt>Status</dt>
              <dd>
                <span className="pj__state" data-state={frameState} aria-live="polite">
                  <span className="pj__dot" aria-hidden="true" />
                  {videoSrc && frameState === "live" ? "Film" : STATUS_LABEL[frameState]}
                </span>
              </dd>
              {active.year && (
                <>
                  <dt>Year</dt>
                  <dd>{active.year}</dd>
                </>
              )}
              {tagList.length > 0 && (
                <>
                  <dt>Stack</dt>
                  <dd>{tagList.join(" · ")}</dd>
                </>
              )}
            </dl>

            <div className="pj__actions">
              {target && (
                <a className="pj__cta" href={target} target="_blank" rel="noopener noreferrer">
                  {displayHost(target)}
                  <ArrowUpRight className="pj__cta-arrow" size={14} aria-hidden="true" />
                </a>
              )}
              {videoSrc && (
                <button
                  type="button"
                  className="pj__cta"
                  onClick={() => {
                    const v = stageVideoRef.current;
                    setMuted((m) => {
                      const next = !m;
                      if (v) {
                        v.muted = next;
                        /* unmuting is the user gesture browsers wait for */
                        if (!next) v.play().catch(() => {});
                      }
                      return next;
                    });
                  }}
                  aria-pressed={!muted}
                >
                  {muted ? (
                    <>
                      <VolumeX className="pj__cta-arrow" size={14} aria-hidden="true" />
                      Sound off
                    </>
                  ) : (
                    <>
                      <Volume2 className="pj__cta-arrow" size={14} aria-hidden="true" />
                      Sound on
                    </>
                  )}
                </button>
              )}
              {(frameable || videoSrc) && (
                <button
                  type="button"
                  className="pj__cta"
                  onClick={() => {
                    soundEngine.play("open");
                    setDialogOpen(true);
                  }}
                >
                  Expand
                  <Maximize2 className="pj__cta-arrow" size={13} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>

          {/* ── The live frame, unobstructed ──────────────────────────── */}
          <div className="pj__framewrap">
            <div
              ref={frameBoxRef}
              className="pj__frame"
              data-state={frameState}
              id={`${baseId}-panel-${selected}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${selected}`}
              tabIndex={-1}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              <span className="pj__loader" aria-hidden="true" />
              {active.thumbnail && (
                <img
                  className="pj__poster"
                  src={active.thumbnail}
                  alt=""
                  data-hidden={posterHidden}
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                />
              )}

              {videoSrc && (
                <video
                  key={videoSrc}
                  ref={stageVideoRef}
                  className="pj__film"
                  src={videoSrc}
                  poster={active.thumbnail ?? undefined}
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setLoadedSrc(videoSrc)}
                  data-loaded={frameState === "live"}
                />
              )}

              {armed && frameable && target && (
                <iframe
                  key={target}
                  className="pj__live"
                  src={target}
                  title={`${active.title} — live preview`}
                  data-loaded={frameState === "live"}
                  onLoad={() => setLoadedSrc(target)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  referrerPolicy="no-referrer-when-downgrade"
                  loading="lazy"
                />
              )}

              {!frameable && target && (
                <div className="pj__overlay">
                  <a className="pj__cta" href={target} target="_blank" rel="noopener noreferrer">
                    Open {displayHost(target)}
                    <ArrowUpRight className="pj__cta-arrow" size={14} aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* ── Slider ───────────────────────────────────────────────── */}
          <div className="pj__nav">
            {projects.length > 1 && (
              <div className="pj__slidertop">
                <button
                  type="button"
                  className="pj__toggle"
                  onClick={() => setAutoplay((a) => (a === "off" ? "on" : "off"))}
                  aria-pressed={autoplayOn}
                  disabled={prefersReducedMotion}
                >
                  {!autoplayOn ? (
                    <>
                      <Play size={11} aria-hidden="true" />
                      Play
                    </>
                  ) : (
                    <>
                      <Pause size={11} aria-hidden="true" />
                      Pause
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="pj__slider">
              <div
                ref={railRef}
                className="pj__rail"
                data-dragging={dragging}
                role="tablist"
                aria-label="Projects"
                aria-orientation="horizontal"
                onKeyDown={onRailKeyDown}
                onPointerDown={onRailPointerDown}
                onPointerMove={onRailPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onPointerLeave={endDrag}
              >
                {projects.map((project, index) => {
                  const distance = Math.abs(index - selected);
                  const preview = previewTarget(project);
                  const tileVideo = PROJECT_VIDEOS[project.id];
                  /* Live tiles only while the section is on screen, and only
                     for mouse users — on touch they are display-only posters,
                     so running real sites inside them was pure cost. */
                  const showLive =
                    !tileVideo && armed && inView && finePointer &&
                    distance <= LIVE_RADIUS && isFrameable(project) && preview;
                  const showTileVideo = tileVideo && armed && inView && distance <= LIVE_RADIUS;
                  const Icon = PROJECT_ICONS[project.id] ?? Globe;

                  return (
                    <button
                      key={project.id}
                      type="button"
                      role="tab"
                      id={`${baseId}-tab-${index}`}
                      aria-selected={index === selected}
                      aria-controls={`${baseId}-panel-${index}`}
                      tabIndex={index === selected ? 0 : -1}
                      ref={(node) => {
                        tabRefs.current[index] = node;
                      }}
                      className="pj__item"
                      /* The browser scrolls a newly focused element into view,
                         and for a slide inside a horizontal scroller that drags
                         the whole PAGE down. Take focus ourselves instead. */
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={(event) => {
                        // a drag shouldn't select whatever it finished over
                        if (drag.current.moved > 6) return;
                        select(index, { manual: true });
                        event.currentTarget.focus({ preventScroll: true });
                      }}
                    >
                      {index === selected && rotating && (
                        <span
                          key={selected}
                          className="pj__progress"
                          onAnimationEnd={() => select(selectedRef.current + 1)}
                          aria-hidden="true"
                        />
                      )}
                      <span className="pj__card-thumb">
                        {project.thumbnail ? (
                          <img src={project.thumbnail} alt="" loading="lazy" decoding="async" />
                        ) : (
                          <span className="pj__card-fallback" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        )}
                        {showTileVideo && (
                          <video
                            className="pj__card-live"
                            src={tileVideo}
                            poster={project.thumbnail ?? undefined}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            aria-hidden="true"
                            tabIndex={-1}
                            data-loaded="true"
                            data-film="true"
                          />
                        )}
                        {showLive && (
                          <iframe
                            className="pj__card-live"
                            src={preview}
                            title=""
                            aria-hidden="true"
                            tabIndex={-1}
                            data-loaded="true"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            sandbox="allow-scripts allow-same-origin"
                          />
                        )}
                        <span className="pj__card-veil" aria-hidden="true" />
                        <Icon className="pj__card-icon" size={13} aria-hidden="true" />
                        <span className="pj__card-foot">
                          <span className="pj__card-idx" aria-hidden="true">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="pj__item-label">{project.title}</span>
                        </span>
                      </span>
                      <span className="pj__item-num" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fullscreen ──────────────────────────────────────────────── */}
      <dialog
        ref={dialogRef}
        className="pj pj__dialog"
        onClose={() => setDialogOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setDialogOpen(false);
        }}
      >
        {dialogOpen && (target || videoSrc) && (
          <>
            <div className="pj__dialog-bar">
              <span className="pj__dialog-name">{active.title}</span>
              {target && <span className="pj__dialog-url">{displayHost(target)}</span>}
              <button
                type="button"
                className="pj__close"
                onClick={() => {
                  soundEngine.play("close");
                  setDialogOpen(false);
                }}
                aria-label="Close preview"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="pj__dialog-body">
              {videoSrc ? (
                <video
                  className="pj__dialog-frame"
                  src={videoSrc}
                  poster={active.thumbnail ?? undefined}
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              ) : (
              <iframe
                className="pj__dialog-frame"
                src={target ?? undefined}
                title={`${active.title} — full screen preview`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                referrerPolicy="no-referrer-when-downgrade"
              />
              )}
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
