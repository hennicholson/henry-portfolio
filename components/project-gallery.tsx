"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  tags: string[];
  year: string;
  iframeable: boolean;
  span?: 2;
  accent: string;
  number: string;
  thumbnail?: string;
}

const fallbackProjects: ProjectData[] = [
  {
    id: "launchpad",
    title: "LaunchPad",
    subtitle: "Landing Funnel Builder for Whop",
    description:
      "A SaaS platform that lets Whop creators build high-converting landing funnels in minutes. Features an AI voice agent that qualifies leads and handles objections.",
    url: "https://onwhop.com",
    tags: ["SaaS", "Whop", "AI", "React"],
    year: "2026",
    iframeable: true,
    span: 2,
    accent: "radial-gradient(ellipse at 90% 10%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "01",
    thumbnail: "/thumbnails/launchpad.webp",
  },
  {
    id: "forefront-usd",
    title: "ForeFront USD",
    subtitle: "Student AI Education Network",
    description:
      "Co-founded the first student-led AI education initiative at the University of South Dakota. 100+ active users within its first six weeks.",
    url: "https://beforefront.com",
    tags: ["EdTech", "AI", "Community"],
    year: "2025",
    iframeable: true,
    accent: "radial-gradient(ellipse at 10% 90%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "02",
    thumbnail: "/thumbnails/forefront.webp",
  },
  {
    id: "skinny-studio",
    title: "Skinny Studio",
    subtitle: "AI Creative Platform on Whop",
    description:
      "An AI-powered creative platform merging technical skill with an advertising eye. Packages creative production tools and workflows into a single membership.",
    url: "https://skinny.studio",
    tags: ["AI", "Creative", "Whop"],
    year: "2025",
    iframeable: true,
    accent: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)",
    number: "03",
    thumbnail: "/thumbnails/skinny-studio.webp",
  },
  {
    id: "slop-design",
    title: "Slop.design",
    subtitle: "Intentional AI Artifact Aesthetics",
    description:
      "A brand identity project that embraces the raw, imperfect artifacts of AI-generated imagery as a deliberate design language.",
    url: "#",
    tags: ["Design", "Brand", "AI"],
    year: "2025",
    iframeable: false,
    span: 2,
    accent: "radial-gradient(ellipse at 90% 90%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "04",
    thumbnail: "/thumbnails/slop-design.webp",
  },
  {
    id: "adventures-in-ai",
    title: "Adventures in AI",
    subtitle: "Weekly Agency Newsletter",
    description:
      "A weekly newsletter authored at Global Prairie, now 53+ issues deep. Distilling the latest AI tools, techniques, and strategic implications.",
    url: "#",
    tags: ["Newsletter", "AI", "Marketing"],
    year: "2025",
    iframeable: false,
    span: 2,
    accent: "radial-gradient(ellipse at 10% 10%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "05",
    thumbnail: "/thumbnails/adventures-ai.webp",
  },
  {
    id: "ai-video-production",
    title: "AI Video Production",
    subtitle: "Multi-Tool Production Pipelines",
    description:
      "End-to-end AI video production pipelines built for commercial projects and major brands. Broadcast-quality content at a fraction of the traditional timeline.",
    url: "#",
    tags: ["Video", "AI", "Production"],
    year: "2025",
    iframeable: false,
    accent: "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.03) 0%, transparent 50%)",
    number: "06",
    thumbnail: "/thumbnails/ai-video.webp",
  },
];

interface ProjectGalleryProps {
  projects?: ProjectData[];
}

export function ProjectGallery({ projects = fallbackProjects }: ProjectGalleryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<HTMLDivElement>(null);
  const clickedCardRef = useRef<HTMLDivElement | null>(null);
  const isAnimating = useRef(false);

  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const iframeLoadedRef = useRef(false);

  // Scroll entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 82%",
          onEnter: () => {
            gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
          },
          once: true,
        });
      }

      const cards = gridRef.current?.querySelectorAll("[data-project-card]");
      if (cards?.length) {
        gsap.set(cards, { y: 50, opacity: 0 });
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: "top 78%",
          onEnter: () => {
            gsap.to(cards, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" });
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Iframe timeout
  useEffect(() => {
    if (!activeProject?.iframeable || !viewerOpen) return;
    iframeLoadedRef.current = false;
    setIframeLoaded(false);
    setIframeError(false);
    const timeout = setTimeout(() => { if (!iframeLoadedRef.current) setIframeError(true); }, 10000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject, viewerOpen]);

  // --- FLIP OPEN ---
  const openViewer = useCallback((project: ProjectData, cardEl: HTMLDivElement) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const rect = cardEl.getBoundingClientRect();
    clickedCardRef.current = cardEl;

    setActiveProject(project);
    setIframeLoaded(false);
    setIframeError(false);
    setViewerOpen(true);
    document.body.style.overflow = "hidden";

    // Hide the original card
    cardEl.style.opacity = "0";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const expand = expandRef.current;
        if (!expand) { isAnimating.current = false; return; }

        // Determine target rect based on viewport
        const isMd = window.innerWidth >= 768;
        const chromeH = 48;
        const panelW = isMd ? 288 : 0;
        const targetTop = chromeH;
        const targetLeft = 0;
        const targetWidth = window.innerWidth - panelW;
        const targetHeight = window.innerHeight - chromeH;

        // Set expanding container to card's exact position
        gsap.set(expand, {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          borderRadius: 12,
          opacity: 1,
        });

        const tl = gsap.timeline({
          onComplete: () => { isAnimating.current = false; },
        });

        // Backdrop fade in
        tl.fromTo("[data-viewer-backdrop]",
          { opacity: 0 },
          { opacity: 1, duration: 0.45, ease: "power2.out" },
          0
        );

        // Card expands to viewer rect
        tl.to(expand, {
          top: targetTop,
          left: targetLeft,
          width: targetWidth,
          height: targetHeight,
          borderRadius: 0,
          duration: 0.55,
          ease: "power3.inOut",
        }, 0);

        // Chrome bar slides in
        tl.fromTo("[data-viewer-chrome]",
          { y: -chromeH, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" },
          0.3
        );

        // Viewer inner content fades in
        tl.fromTo("[data-viewer-inner]",
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" },
          0.35
        );

        // Context panel slides in (desktop only)
        if (isMd) {
          tl.fromTo("[data-context-panel]",
            { x: panelW, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
            0.4
          );
        }

        // Mobile bottom sheet
        if (!isMd) {
          tl.fromTo("[data-mobile-sheet]",
            { y: 200, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
            0.45
          );
        }
      });
    });
  }, []);

  // --- FLIP CLOSE ---
  const closeViewer = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const expand = expandRef.current;
    const cardEl = clickedCardRef.current;

    // Get the card's current rect (scroll may have changed)
    const cardRect = cardEl?.getBoundingClientRect();

    const isMd = window.innerWidth >= 768;

    const tl = gsap.timeline({
      onComplete: () => {
        // Restore original card visibility
        if (cardEl) cardEl.style.opacity = "1";
        setViewerOpen(false);
        setActiveProject(null);
        document.body.style.overflow = "";
        clickedCardRef.current = null;
        isAnimating.current = false;
      },
    });

    // Context panel out (desktop)
    if (isMd) {
      tl.to("[data-context-panel]", { x: 288, opacity: 0, duration: 0.2, ease: "power3.in" }, 0);
    }

    // Mobile bottom sheet out
    if (!isMd) {
      tl.to("[data-mobile-sheet]", { y: 200, opacity: 0, duration: 0.2, ease: "power3.in" }, 0);
    }

    // Chrome bar out
    tl.to("[data-viewer-chrome]", { y: -48, opacity: 0, duration: 0.2, ease: "power3.in" }, 0);

    // Viewer inner content fades out
    tl.to("[data-viewer-inner]", { opacity: 0, duration: 0.2, ease: "power2.in" }, 0);

    // Shrink back to card position
    if (expand && cardRect) {
      tl.to(expand, {
        top: cardRect.top,
        left: cardRect.left,
        width: cardRect.width,
        height: cardRect.height,
        borderRadius: 12,
        duration: 0.45,
        ease: "power3.inOut",
      }, 0.15);
    }

    // Backdrop fade out
    tl.to("[data-viewer-backdrop]", { opacity: 0, duration: 0.35, ease: "power2.in" }, 0.2);
  }, []);

  // Navigate between projects (no FLIP, just crossfade)
  const navigateProject = useCallback(
    (direction: 1 | -1) => {
      if (!activeProject || isAnimating.current) return;
      const idx = projects.findIndex((p) => p.id === activeProject.id);
      const nextIdx = (idx + direction + projects.length) % projects.length;
      const next = projects[nextIdx];

      // Update which card to return to on close — find the visible one (desktop grid or mobile stack)
      const isMd = window.innerWidth >= 768;
      const container = isMd ? gridRef.current : sectionRef.current?.querySelector(".md\\:hidden");
      const nextCard = container?.querySelector(`[data-project-id="${next.id}"]`) as HTMLDivElement | null;
      if (clickedCardRef.current) clickedCardRef.current.style.opacity = "1"; // restore old card
      if (nextCard) {
        nextCard.style.opacity = "0"; // hide new target card
        clickedCardRef.current = nextCard;
      }

      gsap.to("[data-viewer-inner]", {
        x: direction * -60, opacity: 0, duration: 0.2, ease: "power3.in",
        onComplete: () => {
          setActiveProject(next);
          setIframeLoaded(false);
          setIframeError(false);
          gsap.fromTo("[data-viewer-inner]",
            { x: direction * 60, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power3.out" }
          );
        },
      });
    },
    [activeProject]
  );

  // Keyboard nav
  useEffect(() => {
    if (!viewerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeViewer();
      else if (e.key === "ArrowRight") navigateProject(1);
      else if (e.key === "ArrowLeft") navigateProject(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerOpen, closeViewer, navigateProject]);

  // Card inner content (shared between desktop + mobile)
  const CardInner = ({ project }: { project: ProjectData }) => (
    <div className="flex flex-col h-full relative z-[1]">
      {/* Thumbnail zone */}
      {project.thumbnail && (
        <div className="relative overflow-hidden" style={{ minHeight: "120px", flex: "1 1 55%" }}>
          <img
            src={project.thumbnail}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-top transform-gpu transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:-translate-y-1"
            loading="lazy"
          />
          {/* Gradient overlay: transparent top → card bg bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(180deg, transparent 30%, rgba(8, 8, 14, 0.7) 70%, rgba(8, 8, 14, 1) 100%)" }}
          />
        </div>
      )}

      {/* Text content */}
      <div className="p-5 md:p-6 flex flex-col justify-between relative" style={{ flex: project.thumbnail ? "0 0 auto" : "1 1 100%" }}>
        <div>
          {!project.thumbnail && (
            <span
              className="absolute top-3 right-4 text-[64px] md:text-[80px] font-bold leading-none text-white/[0.02] select-none pointer-events-none"
              style={{ fontFeatureSettings: "'tnum'" }}
            >
              {project.number}
            </span>
          )}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2.5">
              <h3 className="text-base md:text-lg font-semibold text-white tracking-tight">
                {project.title}
              </h3>
              <span className="text-[9px] font-mono text-white/20 tracking-wider">
                {project.year}
              </span>
            </div>
            <ArrowUpRight
              size={14}
              className="text-white/0 group-hover:text-white/40 transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
          <p className="text-sm text-white/30 leading-relaxed">{project.subtitle}</p>
          <p className="text-sm text-white/0 group-hover:text-white/25 leading-relaxed mt-2 transition-all duration-500 max-h-0 group-hover:max-h-24 overflow-hidden">
            {project.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded text-white/20 group-hover:text-white/35 transition-colors duration-300"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="relative py-16 md:py-24" data-section="projects">
      <div ref={headerRef} className="w-[90vw] max-w-5xl mx-auto px-6 mb-10 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          What I&apos;m Building
        </h2>
        <p className="mt-3 text-white/25 text-sm md:text-base max-w-lg mx-auto">
          Products, platforms, and experiments at the intersection of AI, marketing, and design.
        </p>
      </div>

      {/* Desktop bento grid */}
      <div
        ref={gridRef}
        className="hidden md:grid grid-cols-3 gap-3 w-[90vw] max-w-5xl mx-auto px-6"
        style={{ gridAutoRows: "minmax(280px, auto)" }}
      >
        {projects.map((project) => (
          <div
            key={project.id}

            data-project-card
            data-project-id={project.id}
            onClick={(e) => openViewer(project, e.currentTarget as HTMLDivElement)}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer transform-gpu transition-all duration-400 hover:-translate-y-1.5 ${
              project.span === 2 ? "col-span-2" : ""
            }`}
            style={{
              background: project.accent + ", linear-gradient(180deg, rgba(12, 12, 20, 0.8) 0%, rgba(8, 8, 14, 0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 -20px 80px -20px rgba(255,255,255,0.03) inset",
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s, box-shadow 0.4s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.14)";
              el.style.boxShadow = "0 -20px 80px -20px rgba(255,255,255,0.08) inset, 0 12px 40px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.06)";
              el.style.boxShadow = "0 -20px 80px -20px rgba(255,255,255,0.03) inset";
            }}
          >
            <div
              className="absolute top-0 left-[10%] right-[10%] h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)" }}
            />
            <CardInner project={project} />
          </div>
        ))}
      </div>

      {/* Mobile stack */}
      <div className="md:hidden flex flex-col gap-3 px-6 max-w-lg mx-auto">
        {projects.map((project) => (
          <div
            key={project.id}

            data-project-card
            data-project-id={project.id}
            onClick={(e) => openViewer(project, e.currentTarget as HTMLDivElement)}
            className="group relative overflow-hidden rounded-xl cursor-pointer active:scale-[0.98] transition-transform"
            style={{
              background: project.accent + ", linear-gradient(180deg, rgba(12, 12, 20, 0.8) 0%, rgba(8, 8, 14, 0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 -20px 80px -20px rgba(255,255,255,0.03) inset",
            }}
          >
            {project.thumbnail && (
              <div className="relative overflow-hidden" style={{ height: "120px" }}>
                <img
                  src={project.thumbnail}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(180deg, transparent 20%, rgba(8, 8, 14, 0.6) 65%, rgba(8, 8, 14, 1) 100%)" }}
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-semibold text-white">{project.title}</h3>
                  <span className="text-[9px] font-mono text-white/20">{project.year}</span>
                </div>
                <ArrowUpRight size={14} className="text-white/20" />
              </div>
              <p className="text-sm text-white/30">{project.subtitle}</p>
              <p className="text-xs text-white/20 mt-2 leading-relaxed">{project.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── VIEWER OVERLAY ─── */}
      {viewerOpen && activeProject && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            data-viewer-backdrop
            className="absolute inset-0 bg-[#050508]/95"
            onClick={closeViewer}
          />

          {/* Chrome bar */}
          <div
            data-viewer-chrome
            className="absolute top-0 left-0 right-0 h-12 z-20 flex items-center px-4 gap-4"
            style={{ background: "rgba(14, 14, 22, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-white text-sm font-semibold truncate">{activeProject.title}</span>
            <span className="text-white/15 text-xs hidden sm:inline truncate">{activeProject.subtitle}</span>
            <div className="flex-1 hidden sm:flex justify-center">
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-4 py-1 max-w-sm w-full">
                <span className="text-white/15 text-[10px] font-mono truncate block text-center">
                  {activeProject.url === "#" ? `${activeProject.id}.app` : activeProject.url}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 flex-shrink-0">
              <button onClick={(e) => { e.stopPropagation(); navigateProject(-1); }} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ChevronLeft size={16} /></button>
              <button onClick={(e) => { e.stopPropagation(); navigateProject(1); }} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ChevronRight size={16} /></button>
              <a href={activeProject.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ExternalLink size={16} /></a>
              <button onClick={(e) => { e.stopPropagation(); closeViewer(); }} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50 ml-1"><X size={16} /></button>
            </div>
          </div>

          {/* Expanding container — starts at card rect, grows to viewer rect */}
          <div
            ref={expandRef}
            data-viewer-expand
            className="z-10 overflow-hidden"
            style={{
              position: "fixed",
              background: "rgba(10, 10, 16, 0.95)",
              border: "1px solid rgba(255,255,255,0.06)",
              opacity: 0,
            }}
          >
            <div data-viewer-inner className="w-full h-full relative">
              {activeProject.iframeable && !iframeLoaded && !iframeError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(255,255,255,0.15)", borderTopColor: "transparent" }} />
                </div>
              )}
              {activeProject.iframeable && !iframeError && (
                <iframe
                  src={activeProject.url}
                  className={`w-full h-full border-0 transition-opacity duration-500 ${iframeLoaded ? "opacity-100" : "opacity-0"}`}
                  onLoad={() => { iframeLoadedRef.current = true; setIframeLoaded(true); }}
                  onError={() => setIframeError(true)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={activeProject.title}
                />
              )}
              {(!activeProject.iframeable || iframeError) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="w-[75%] max-w-xl aspect-video rounded-xl overflow-hidden relative"
                    style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                      <span className="text-3xl md:text-4xl font-bold text-white/[0.06] tracking-tight select-none">
                        {activeProject.title}
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-white/20 text-xs font-mono">
                    {iframeError ? "Preview could not be loaded." : "Live preview coming soon."}
                  </p>
                  <a
                    href={activeProject.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm text-white/60 hover:text-white/80 transition-colors"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    Visit Site <ArrowUpRight size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Context panel — desktop */}
          <div
            data-context-panel
            className="absolute top-12 bottom-0 right-0 w-72 hidden md:flex flex-col p-5 overflow-y-auto z-10"
            style={{ background: "rgba(12, 12, 20, 0.95)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-[10px] font-mono tracking-wider uppercase text-white/20 mb-4 block">{activeProject.year}</span>
            <h3 className="text-lg font-bold text-white mb-0.5 tracking-tight">{activeProject.title}</h3>
            <p className="text-white/25 text-sm mb-4">{activeProject.subtitle}</p>
            <p className="text-white/35 text-sm leading-relaxed mb-5">{activeProject.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {activeProject.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded text-white/25" style={{ background: "rgba(255,255,255,0.04)" }}>
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-auto">
              <a
                href={activeProject.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm text-white/60 hover:text-white/80 transition-colors"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Visit Live Site <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Mobile bottom sheet */}
          <div
            data-mobile-sheet
            className="md:hidden absolute bottom-0 left-0 right-0 p-4 max-h-[40vh] overflow-y-auto z-10"
            style={{ background: "rgba(12, 12, 20, 0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-white">{activeProject.title}</h3>
                <p className="text-white/25 text-sm">{activeProject.subtitle}</p>
              </div>
              <button onClick={closeViewer} className="p-1.5 rounded-lg bg-white/[0.05] text-white/30">
                <X size={14} />
              </button>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-3">{activeProject.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}
