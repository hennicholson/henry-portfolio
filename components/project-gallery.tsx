"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, ChevronLeft, ChevronRight, X, ArrowUpRight } from "lucide-react";
import { soundEngine } from "@/lib/sounds";

gsap.registerPlugin(ScrollTrigger);

export interface CaseStudy {
  highlights: { label: string; value: string }[];
  stack?: string[];
  gallery?: string[];
  role?: string;
}

export interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  previewUrl?: string;
  tags: string[];
  year: string;
  iframeable: boolean;
  span?: 2;
  accent: string;
  number: string;
  thumbnail?: string;
  caseStudy?: CaseStudy;
}

export const fallbackProjects: ProjectData[] = [
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
    caseStudy: {
      role: "Solo Engineer & Designer",
      highlights: [
        { label: "Templates", value: "6 pre-built" },
        { label: "UI Primitives", value: "30+" },
        { label: "Editor", value: "Google Docs-style" },
        { label: "Stack", value: "Next.js + Tiptap" },
      ],
      stack: ["Next.js 16", "TypeScript", "Tiptap", "Framer Motion", "Supabase", "Whop API", "Zustand", "Radix UI"],
    },
  },
  {
    id: "forefront-usd",
    title: "ForeFront USD",
    subtitle: "Student AI Education Network",
    description:
      "Co-founded the first student-led AI education initiative at the University of San Diego. 100+ active users within its first six weeks.",
    url: "https://beforefront.com",
    tags: ["EdTech", "AI", "Community"],
    year: "2025",
    iframeable: true,
    accent: "radial-gradient(ellipse at 10% 90%, rgba(255,255,255,0.04) 0%, transparent 60%)",
    number: "02",
    thumbnail: "/thumbnails/forefront.webp",
    caseStudy: {
      role: "Co-Founder & Lead Developer",
      highlights: [
        { label: "Users", value: "100+" },
        { label: "Timeline", value: "6 weeks" },
        { label: "First at", value: "USD" },
        { label: "Focus", value: "AI literacy" },
      ],
      gallery: ["/deep-dive/forefront-slide-1.png", "/deep-dive/forefront-slide-2.png", "/deep-dive/forefront-slide-3.png"],
    },
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
    caseStudy: {
      role: "Founder & Creative Director",
      highlights: [
        { label: "Platform", value: "Whop" },
        { label: "Focus", value: "AI + Ads" },
        { label: "Type", value: "Membership" },
        { label: "Content", value: "Video + Design" },
      ],
      stack: ["Next.js", "AI Pipelines", "Whop", "Motion Graphics"],
      gallery: ["/deep-dive/skinny-mockup-1.png", "/deep-dive/skinny-mockup-2.png", "/deep-dive/skinny-mock.jpeg"],
    },
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
    caseStudy: {
      role: "Brand Designer & Developer",
      highlights: [
        { label: "Concept", value: "Anti-polish" },
        { label: "Medium", value: "AI imagery" },
        { label: "Backend", value: "Supabase" },
        { label: "Approach", value: "Artifacts as art" },
      ],
      stack: ["Next.js", "Supabase", "Drizzle ORM", "AI Generation"],
    },
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
    caseStudy: {
      role: "Author & Strategist",
      highlights: [
        { label: "Issues", value: "53+" },
        { label: "Cadence", value: "Weekly" },
        { label: "Org", value: "Global Prairie" },
        { label: "Topics", value: "AI + Strategy" },
      ],
    },
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
    caseStudy: {
      role: "Producer & Pipeline Architect",
      highlights: [
        { label: "Output", value: "Broadcast-quality" },
        { label: "Pipeline", value: "Multi-tool" },
        { label: "Speed", value: "10x faster" },
        { label: "Clients", value: "Major brands" },
      ],
      stack: ["Runway", "Kling", "Seedance", "After Effects", "Premiere", "DaVinci"],
    },
  },
];

// ─── DEEP DIVE COMPONENT ───
interface BrandDataType {
  favicon: string | null;
  ogImage: string | null;
  themeColor: string | null;
  title: string | null;
  description: string | null;
}

function DeepDiveContent({ project, brandData }: { project: ProjectData; brandData: BrandDataType | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const mockupInnerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [countersVisible, setCountersVisible] = useState(false);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  const bc = brandData?.themeColor || "#6366f1";
  const cs = project.caseStudy;
  const gallery = cs?.gallery || [];

  useEffect(() => { setGalleryIdx(0); setCountersVisible(false); }, [project.id]);

  // ── Entrance choreography ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .fromTo("[data-dd-hero-img]", { scale: 1.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" })
        .fromTo("[data-dd-year]", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5 }, "-=0.8")
        .fromTo("[data-dd-title]", { opacity: 0, y: 40, clipPath: "inset(100% 0 0 0)" }, { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", duration: 1, ease: "power4.out" }, "-=0.5")
        .fromTo("[data-dd-subtitle]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.6");
    }, el);
    return () => ctx.revert();
  }, [project.id]);

  // ── Scroll-driven reveals ──
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const reveals = scroller.querySelectorAll<HTMLElement>("[data-dd-reveal]");
    const countersEl = scroller.querySelector("[data-dd-counters]");

    let raf: number;
    const heroImg = heroImgRef.current;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollY = scroller.scrollTop;
        const viewH = scroller.clientHeight;

        // Hero parallax
        if (heroImg) {
          const heroH = heroImg.parentElement?.offsetHeight || 600;
          const p = Math.min(scrollY / heroH, 1);
          heroImg.style.transform = `translateY(${scrollY * 0.4}px) scale(${1 + p * 0.06})`;
          heroImg.style.opacity = String(1 - p * 0.4);
        }

        // Reveal sections
        reveals.forEach((el) => {
          if (el.dataset.ddRevealed) return;
          const rect = el.getBoundingClientRect();
          const containerRect = scroller.getBoundingClientRect();
          const elTop = rect.top - containerRect.top;
          if (elTop < viewH * 0.85) {
            el.dataset.ddRevealed = "1";
            const dir = el.dataset.ddDir || "up";
            const fromVars: Record<string, unknown> = { opacity: 0 };
            if (dir === "up") fromVars.y = 50;
            if (dir === "left") fromVars.x = -60;
            if (dir === "right") fromVars.x = 60;
            if (dir === "scale") { fromVars.scale = 0.9; fromVars.y = 30; }
            gsap.fromTo(el, fromVars, { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.9, ease: "power3.out" });
          }
        });

        // Counter trigger
        if (countersEl && !countersVisible) {
          const rect = countersEl.getBoundingClientRect();
          const containerRect = scroller.getBoundingClientRect();
          if (rect.top - containerRect.top < viewH * 0.8) {
            setCountersVisible(true);
          }
        }
      });
    };

    // Init reveals as hidden
    reveals.forEach((el) => { gsap.set(el, { opacity: 0 }); });

    scroller.addEventListener("scroll", onScroll, { passive: true });
    // Trigger once for elements already in view
    setTimeout(onScroll, 100);
    return () => { scroller.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [project.id, countersVisible]);

  // ── Mouse parallax on hero ──
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouseRef.current = { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
      // Subtle parallax on hero title
      const title = el.querySelector("[data-dd-title]") as HTMLElement;
      if (title) {
        const dx = (mouseRef.current.x - 0.5) * -8;
        const dy = (mouseRef.current.y - 0.5) * -4;
        title.style.transform = `translate(${dx}px, ${dy}px)`;
      }
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [project.id]);

  // ── Mockup tilt ──
  useEffect(() => {
    const mockup = mockupRef.current;
    const inner = mockupInnerRef.current;
    const glow = glowRef.current;
    if (!mockup || !inner) return;
    let raf: number;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = mockup.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        inner.style.transform = `rotateX(${(0.5 - y) * 6}deg) rotateY(${(x - 0.5) * 8}deg) scale(1.01)`;
        if (glow) { glow.style.opacity = "0.7"; glow.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, ${bc}30 0%, transparent 60%)`; }
      });
    };
    const onLeave = () => {
      gsap.to(inner, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.8, ease: "elastic.out(1,0.5)" });
      if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 });
    };
    mockup.addEventListener("mousemove", onMove);
    mockup.addEventListener("mouseleave", onLeave);
    return () => { mockup.removeEventListener("mousemove", onMove); mockup.removeEventListener("mouseleave", onLeave); cancelAnimationFrame(raf); };
  }, [bc, project.id]);

  const cleanUrl = project.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Extract numeric value from highlight for counter animation
  const parseNum = (val: string): { num: number; suffix: string } | null => {
    const m = val.match(/^(\d+)(.*)$/);
    return m ? { num: parseInt(m[1]), suffix: m[2] } : null;
  };

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ "--dd-accent": bc } as React.CSSProperties}>
      <div ref={scrollRef} className="w-full h-full overflow-y-auto dd-smooth-scroll">

        {/* ══════ HERO — FULL VIEWPORT ══════ */}
        <div className="relative w-full overflow-hidden" style={{ height: "100vh", minHeight: "500px" }}>
          <div ref={heroImgRef} data-dd-hero-img className="absolute will-change-transform" style={{ top: "-15%", left: 0, right: 0, height: "130%" }}>
            <img src={brandData?.ogImage || project.thumbnail || ""} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: "center 20%" }} />
            <div className="absolute inset-0 dd-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
          </div>

          {/* Cinematic gradients */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(5,5,8,0.3) 0%, transparent 30%, transparent 45%, ${bc}06 60%, rgba(5,5,8,0.95) 82%, #050508 100%)` }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 130% 100% at 50% 40%, transparent 40%, rgba(5,5,8,0.7) 100%)" }} />

          {/* Brand glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none" style={{ width: "60%", height: "40%", background: `radial-gradient(ellipse at 50% 100%, ${bc}15 0%, transparent 70%)`, filter: "blur(100px)" }} />

          {/* Favicon */}
          {brandData?.favicon && (
            <div className="absolute top-8 left-8 md:top-10 md:left-12 z-10">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <img src={brandData.favicon} alt="" className="w-5 h-5" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            </div>
          )}

          {/* Title lockup — bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-16 md:px-12 md:pb-20 lg:px-20">
            <div className="max-w-5xl">
              <div className="flex items-center gap-3 mb-5 flex-wrap">
                <span data-dd-year className="text-[10px] font-mono tracking-[0.3em] uppercase px-3 py-1.5 rounded-full" style={{ color: bc, background: `${bc}0f`, border: `1px solid ${bc}1a` }}>
                  {project.year}
                </span>
                {cs?.role && (
                  <span data-dd-year className="text-[10px] font-mono tracking-[0.15em] uppercase px-3 py-1.5 rounded-full text-white/25" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    {cs.role}
                  </span>
                )}
              </div>
              <h2 data-dd-title className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-[-0.04em] leading-[0.88] mb-4 will-change-transform" style={{ transition: "transform 0.15s ease-out" }}>
                {project.title}
              </h2>
              <p data-dd-subtitle className="text-lg sm:text-xl md:text-2xl text-white/35 font-light tracking-[-0.01em] max-w-2xl leading-relaxed">
                {project.subtitle}
              </p>
              {/* Scroll hint */}
              <div className="mt-10 flex items-center gap-3 opacity-40">
                <div className="w-px h-8 bg-white/20 dd-scroll-hint" />
                <span className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/30">Scroll to explore</span>
              </div>
            </div>
          </div>
        </div>

        {/* ══════ CONTENT ══════ */}
        <div className="relative z-10" style={{ background: "#050508" }}>
          {/* Accent separator */}
          <div className="w-full h-px" style={{ background: `linear-gradient(90deg, transparent 10%, ${bc}40 50%, transparent 90%)` }} />

          {/* ── HIGHLIGHTS — full bleed grid ── */}
          {cs?.highlights && (
            <div data-dd-counters data-dd-reveal data-dd-dir="up" className="w-full border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <div className="grid grid-cols-2 md:grid-cols-4">
                {cs.highlights.map((h, i) => {
                  const parsed = countersVisible ? parseNum(h.value) : null;
                  return (
                    <div
                      key={h.label}
                      className="relative group/stat p-8 md:p-10 cursor-default"
                      style={{
                        borderRight: i < cs.highlights.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                        transition: "background 0.4s ease",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = `${bc}06`; soundEngine.play("hover"); }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                    >
                      <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/15 mb-3">{h.label}</div>
                      <div className="text-3xl md:text-4xl font-bold tracking-tight" style={{ color: bc + "cc" }}>
                        {parsed ? <AnimatedCounter target={parsed.num} suffix={parsed.suffix} active={countersVisible} /> : h.value}
                      </div>
                      {/* Hover glow line at top */}
                      <div className="absolute top-0 left-[20%] right-[20%] h-px opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(90deg, transparent, ${bc}40, transparent)` }} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── DESCRIPTION — wide, cinematic ── */}
          <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-20 pt-20 md:pt-28 pb-16 md:pb-24">
            <div data-dd-reveal data-dd-dir="up" className="mb-6">
              <div className="flex flex-wrap gap-2.5 mb-12">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-[11px] font-mono tracking-[0.15em] uppercase text-white/20 px-4 py-2 rounded-full cursor-default" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = bc + "35"; e.currentTarget.style.color = bc; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.2)"; }}
                  >{tag}</span>
                ))}
              </div>
              <p className="text-white/45 text-xl sm:text-2xl md:text-3xl leading-[1.6] font-light tracking-[-0.01em] max-w-3xl">
                {project.description}
              </p>
            </div>

            {brandData?.description && brandData.description !== project.description && (
              <div data-dd-reveal data-dd-dir="left" className="mt-14 relative pl-8 md:pl-10 max-w-2xl">
                <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full" style={{ background: `linear-gradient(180deg, ${bc} 0%, ${bc}15 100%)` }} />
                <p className="text-white/20 text-sm md:text-base leading-[1.9] italic font-light">&ldquo;{brandData.description}&rdquo;</p>
                <div className="mt-3 text-[9px] font-mono tracking-[0.25em] uppercase text-white/10">{cleanUrl}</div>
              </div>
            )}
          </div>

          {/* ── TECH STACK — horizontal scroll feel ── */}
          {cs?.stack && cs.stack.length > 0 && (
            <div data-dd-reveal data-dd-dir="right" className="py-12 md:py-16 border-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <div className="max-w-5xl mx-auto px-8 md:px-12 lg:px-20">
                <div className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/12 mb-6">Built with</div>
                <div className="flex flex-wrap gap-3">
                  {cs.stack.map((tech, i) => (
                    <span
                      key={tech}
                      className="text-[13px] font-mono text-white/30 px-5 py-2.5 rounded-lg cursor-default group/tech relative overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)" }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = bc + "30";
                        el.style.color = "rgba(255,255,255,0.7)";
                        el.style.background = bc + "08";
                        el.style.transform = "translateY(-2px)";
                        el.style.boxShadow = `0 4px 20px ${bc}15`;
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget;
                        el.style.borderColor = "rgba(255,255,255,0.04)";
                        el.style.color = "rgba(255,255,255,0.3)";
                        el.style.background = "rgba(255,255,255,0.02)";
                        el.style.transform = "translateY(0)";
                        el.style.boxShadow = "none";
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── GALLERY — full-bleed immersive ── */}
          {gallery.length > 0 && (
            <div data-dd-reveal data-dd-dir="scale" className="py-16 md:py-24">
              <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden" style={{ boxShadow: `0 30px 80px rgba(0,0,0,0.4), 0 0 120px ${bc}08`, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={gallery[galleryIdx]} alt={`${project.title} ${galleryIdx + 1}`} className="w-full h-auto block" key={galleryIdx} />

                  {/* Overlay controls */}
                  {gallery.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <button onClick={() => { setGalleryIdx((galleryIdx - 1 + gallery.length) % gallery.length); soundEngine.play("swooshIn"); }} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <ChevronLeft size={16} className="text-white/80" />
                      </button>
                      <button onClick={() => { setGalleryIdx((galleryIdx + 1) % gallery.length); soundEngine.play("swooshIn"); }} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <ChevronRight size={16} className="text-white/80" />
                      </button>
                    </div>
                  )}

                  {/* Bottom counter */}
                  {gallery.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}>
                      {gallery.map((_, i) => (
                        <button key={i} onClick={() => { setGalleryIdx(i); soundEngine.play("click"); }} className="w-2 h-2 rounded-full transition-all duration-300" style={{ background: i === galleryIdx ? bc : "rgba(255,255,255,0.25)", transform: i === galleryIdx ? "scale(1.3)" : "scale(1)" }} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── BROWSER MOCKUP — immersive with tilt ── */}
          {project.thumbnail && (
            <div data-dd-reveal data-dd-dir="scale" className="py-16 md:py-24">
              <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div ref={mockupRef} className="relative" style={{ perspective: "1600px" }}>
                  <div ref={glowRef} className="absolute -inset-8 md:-inset-14 rounded-3xl pointer-events-none opacity-0 transition-opacity duration-500" />
                  <div ref={mockupInnerRef} className="relative rounded-xl md:rounded-2xl overflow-hidden dd-browser-shadow will-change-transform" style={{ transformStyle: "preserve-3d", transition: "transform 0.08s ease-out", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Chrome bar */}
                    <div className="flex items-center gap-2 px-4 py-3 md:py-3.5" style={{ background: "rgba(18,18,28,0.95)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex gap-1.5 mr-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,95,87,0.7)" }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: "rgba(255,189,46,0.7)" }} />
                        <div className="w-3 h-3 rounded-full" style={{ background: "rgba(39,201,63,0.7)" }} />
                      </div>
                      <div className="flex-1 mx-2 md:mx-16 px-4 py-1.5 rounded-lg text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}>
                        <span className="text-[11px] font-mono text-white/20 tracking-wide">{cleanUrl || project.id + ".app"}</span>
                      </div>
                    </div>
                    {/* Screenshot */}
                    <div className="relative overflow-hidden"
                      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const s = e.currentTarget.querySelector("[data-spotlight]") as HTMLElement; if (s) { s.style.opacity = "1"; s.style.background = `radial-gradient(circle 250px at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(255,255,255,0.05) 0%, transparent 100%)`; } }}
                      onMouseLeave={(e) => { const s = e.currentTarget.querySelector("[data-spotlight]") as HTMLElement; if (s) s.style.opacity = "0"; }}
                    >
                      <img src={project.thumbnail} alt={project.title} className="w-full h-auto block" />
                      <div data-spotlight className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300" />
                    </div>
                  </div>
                  {/* Reflection */}
                  <div className="hidden md:block absolute left-[8%] right-[8%] h-20 -bottom-14 rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${bc}18 0%, transparent 80%)`, filter: "blur(30px)", opacity: 0.5 }} />
                </div>
              </div>
            </div>
          )}

          {/* ── CTA — centered, bold ── */}
          {project.url !== "#" && (
            <div data-dd-reveal data-dd-dir="up" className="py-20 md:py-28 flex flex-col items-center text-center">
              <p className="text-white/15 text-sm font-mono tracking-wider mb-6">See it live</p>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="dd-cta group relative inline-flex items-center gap-4 px-12 py-5 rounded-2xl text-base font-medium text-white/90 hover:text-white transition-all duration-500 hover:-translate-y-1"
                style={{ background: `${bc}12`, border: `1px solid ${bc}25`, backdropFilter: "blur(16px)" }}
                onMouseEnter={(e) => { soundEngine.play("hover"); const g = e.currentTarget.querySelector("[data-dd-cta-glow]") as HTMLElement; if (g) gsap.to(g, { opacity: 1, duration: 0.4 }); e.currentTarget.style.boxShadow = `0 8px 40px ${bc}25`; }}
                onMouseLeave={(e) => { const g = e.currentTarget.querySelector("[data-dd-cta-glow]") as HTMLElement; if (g) gsap.to(g, { opacity: 0, duration: 0.6 }); e.currentTarget.style.boxShadow = "none"; }}
              >
                <div data-dd-cta-glow className="absolute inset-0 rounded-2xl pointer-events-none opacity-0" style={{ background: `radial-gradient(ellipse at 50% 50%, ${bc}30 0%, transparent 70%)`, borderRadius: "inherit" }} />
                <span className="relative z-10 flex items-center gap-3">
                  {cleanUrl}
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px]" />
                </span>
              </a>
            </div>
          )}

          {/* Bottom spacer */}
          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}

// Animated counter component
function AnimatedCounter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

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

  // Deep-dive brand data
  interface BrandData {
    favicon: string | null;
    ogImage: string | null;
    themeColor: string | null;
    title: string | null;
    description: string | null;
  }
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const brandCache = useRef<Map<string, BrandData>>(new Map());
  const [deepDiveMode, setDeepDiveMode] = useState(false);

  const noteRef = useRef<HTMLDivElement>(null);

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

      // Post-it note entrance
      if (noteRef.current) {
        gsap.set(noteRef.current, { opacity: 0, x: 60, rotation: 8, scale: 0.8 });
        ScrollTrigger.create({
          trigger: gridRef.current || sectionRef.current,
          start: "top 70%",
          onEnter: () => {
            gsap.to(noteRef.current, {
              opacity: 1,
              x: 0,
              rotation: -2,
              scale: 1,
              duration: 0.7,
              ease: "back.out(1.6)",
              delay: 0.4,
            });
            // Dismiss after 6 seconds
            gsap.to(noteRef.current, {
              opacity: 0,
              x: 40,
              rotation: 6,
              scale: 0.9,
              duration: 0.5,
              ease: "power2.in",
              delay: 6.5,
            });
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
    const timeout = setTimeout(() => { if (!iframeLoadedRef.current) setIframeError(true); }, 5000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProject, viewerOpen]);

  // Resize expand container when deep dive toggles
  useEffect(() => {
    const expand = expandRef.current;
    if (!expand || !viewerOpen) return;
    const isMd = window.innerWidth >= 768;

    if (deepDiveMode) {
      // Full screen — no chrome bar, no side panel
      gsap.to(expand, {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        borderRadius: 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
    } else {
      // Standard — chrome bar + side panel
      const chromeH = 48;
      const panelW = isMd ? 288 : 0;
      gsap.to(expand, {
        top: chromeH,
        left: 0,
        width: window.innerWidth - panelW,
        height: window.innerHeight - chromeH,
        borderRadius: 0,
        duration: 0.5,
        ease: "power3.inOut",
      });
    }
  }, [deepDiveMode, viewerOpen]);

  // Fetch brand data when project opens
  useEffect(() => {
    if (!activeProject || !viewerOpen) {
      setBrandData(null);
      setDeepDiveMode(false);
      return;
    }

    const url = activeProject.url;
    if (url === "#") {
      setBrandData(null);
      return;
    }

    // Check cache
    if (brandCache.current.has(url)) {
      setBrandData(brandCache.current.get(url)!);
      return;
    }

    fetch(`/api/projects/brand?url=${encodeURIComponent(url)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && !data.error) {
          brandCache.current.set(url, data);
          setBrandData(data);
        }
      })
      .catch(() => {});
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
    soundEngine.play("open");

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

    soundEngine.play("close");

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

      soundEngine.play("whoosh");
      gsap.to("[data-viewer-inner]", {
        x: direction * -60, opacity: 0, duration: 0.2, ease: "power3.in",
        onComplete: () => {
          setActiveProject(next);
          setIframeLoaded(false);
          setIframeError(false);
          setDeepDiveMode(false);
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
            data-card-thumb
            src={project.thumbnail}
            alt={`${project.title} — project thumbnail`}
            className="absolute inset-0 w-full h-full object-cover object-top transform-gpu transition-transform duration-700 ease-out group-hover:scale-[1.06]"
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
      <div ref={headerRef} className="w-[90vw] max-w-5xl mx-auto px-4 md:px-6 mb-10 text-center relative">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
          What I&apos;m Building
        </h2>
        <p className="mt-3 text-white/25 text-sm md:text-base max-w-lg mx-auto">
          Products, platforms, and experiments at the intersection of AI, marketing, and design.
        </p>

        {/* Post-it note */}
        <div
          ref={noteRef}
          className="hidden lg:block absolute -right-4 xl:right-0 top-2 pointer-events-none select-none"
          style={{ opacity: 0 }}
        >
          {/* Arrow */}
          <svg
            width="60"
            height="40"
            viewBox="0 0 60 40"
            className="absolute -left-14 top-8"
            style={{ transform: "rotate(-5deg)" }}
          >
            <path
              d="M55 5 C 40 5, 15 8, 5 30"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="4 3"
            />
            <path
              d="M2 24 L5 31 L10 26"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Note */}
          <div
            className="relative px-4 py-3 rounded-sm"
            style={{
              background: "rgba(255, 235, 120, 0.08)",
              border: "1px solid rgba(255, 235, 120, 0.12)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,235,120,0.05) inset",
              transform: "rotate(-2deg)",
              maxWidth: "180px",
            }}
          >
            <p
              className="text-[11px] leading-relaxed"
              style={{
                fontFamily: "var(--font-caveat), cursive",
                color: "rgba(255, 235, 120, 0.55)",
                fontSize: "17px",
              }}
            >
              Click any project for an interactive preview!
            </p>
            {/* Tape strip */}
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-2.5 rounded-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop bento grid */}
      <div
        ref={gridRef}
        className="hidden md:grid grid-cols-3 gap-3 w-[90vw] max-w-5xl mx-auto px-4 md:px-6"
        style={{ gridAutoRows: "minmax(280px, auto)" }}
      >
        {projects.map((project) => (
          <div
            key={project.id}

            data-project-card
            data-project-id={project.id}
            onClick={(e) => { soundEngine.play("cardClick"); openViewer(project, e.currentTarget as HTMLDivElement); }}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-xl cursor-pointer transform-gpu transition-all duration-400 hover:-translate-y-1.5 ${
              project.span === 2 ? "col-span-2" : ""
            }`}
            style={{
              background: project.accent + ", linear-gradient(180deg, rgba(12, 12, 20, 0.8) 0%, rgba(8, 8, 14, 0.9) 100%)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow: "0 -20px 80px -20px rgba(255,255,255,0.03) inset",
              transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.3s, box-shadow 0.4s",
            }}
            onMouseMove={(e) => {
              const el = e.currentTarget as HTMLElement;
              const rect = el.getBoundingClientRect();
              const dx = ((e.clientX - rect.left) / rect.width - 0.5) * -8;
              const dy = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
              const thumb = el.querySelector("[data-card-thumb]") as HTMLElement;
              if (thumb) {
                thumb.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
              }
            }}
            onMouseEnter={(e) => {
              soundEngine.playThrottled("cardHover", 150);
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.14)";
              el.style.boxShadow = "0 -20px 80px -20px rgba(255,255,255,0.08) inset, 0 12px 40px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "rgba(255,255,255,0.06)";
              el.style.boxShadow = "0 -20px 80px -20px rgba(255,255,255,0.03) inset";
              const thumb = el.querySelector("[data-card-thumb]") as HTMLElement;
              if (thumb) {
                thumb.style.transform = "";
              }
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
      <div className="md:hidden flex flex-col gap-3 px-4 max-w-lg mx-auto">
        {projects.map((project) => (
          <div
            key={project.id}

            data-project-card
            data-project-id={project.id}
            onClick={(e) => { soundEngine.play("cardClick"); openViewer(project, e.currentTarget as HTMLDivElement); }}
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
                  alt={`${project.title} — project thumbnail`}
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
          {/* Backdrop with brand color wash */}
          <div
            data-viewer-backdrop
            className="absolute inset-0 transition-colors duration-700"
            onClick={closeViewer}
            style={{
              background: brandData?.themeColor
                ? `radial-gradient(ellipse at 50% 30%, ${brandData.themeColor}15 0%, rgba(5,5,8,0.97) 70%)`
                : "rgba(5,5,8,0.97)",
            }}
          />

          {/* Brand ambient glow */}
          {brandData?.themeColor && (
            <div
              className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-1000"
              style={{
                opacity: deepDiveMode ? 0.4 : 0.15,
                background: `radial-gradient(circle at 30% 20%, ${brandData.themeColor}20 0%, transparent 50%), radial-gradient(circle at 70% 80%, ${brandData.themeColor}10 0%, transparent 40%)`,
              }}
            />
          )}

          {/* Chrome bar — standard mode */}
          {!deepDiveMode && (
            <div
              data-viewer-chrome
              className="absolute top-0 left-0 right-0 h-12 z-20 flex items-center px-4 gap-4"
              style={{ background: "rgba(14, 14, 22, 0.95)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {brandData?.favicon && (
                  <img src={brandData.favicon} alt="" className="w-4 h-4 rounded-sm shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <span className="text-white text-sm font-semibold truncate">{activeProject.title}</span>
                <span className="text-white/15 text-xs hidden sm:inline truncate">{activeProject.subtitle}</span>
              </div>
              <div className="flex-1 hidden sm:flex justify-center">
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-4 py-1 max-w-sm w-full">
                  <span className="text-white/15 text-[10px] font-mono truncate block text-center">
                    {activeProject.url === "#" ? `${activeProject.id}.app` : activeProject.url}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                {(brandData?.ogImage || activeProject.thumbnail) && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeepDiveMode(true); soundEngine.play("reveal"); }}
                    className="px-3.5 py-1.5 rounded-lg transition-all duration-300 text-[11px] font-medium tracking-wide mr-2 flex items-center gap-1.5"
                    style={{
                      background: brandData?.themeColor ? brandData.themeColor + "18" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${brandData?.themeColor ? brandData.themeColor + "30" : "rgba(255,255,255,0.1)"}`,
                      color: brandData?.themeColor || "rgba(255,255,255,0.55)",
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: brandData?.themeColor || "rgba(255,255,255,0.4)", boxShadow: `0 0 6px ${brandData?.themeColor || "rgba(255,255,255,0.3)"}` }} />
                    Deep Dive
                  </button>
                )}
                <button onClick={(e) => { e.stopPropagation(); navigateProject(-1); }} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ChevronLeft size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); navigateProject(1); }} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ChevronRight size={16} /></button>
                <a href={activeProject.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ExternalLink size={16} /></a>
                <button onClick={(e) => { e.stopPropagation(); closeViewer(); }} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50 ml-1"><X size={16} /></button>
              </div>
            </div>
          )}

          {/* Floating toolbar — deep dive mode */}
          {deepDiveMode && (
            <div
              className="fixed top-5 right-5 z-30 flex items-center gap-1.5 px-2 py-1.5 rounded-xl"
              style={{
                background: "rgba(10,10,16,0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setDeepDiveMode(false); soundEngine.play("close"); }}
                className="px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase text-white/40 hover:text-white/70 transition-colors hover:bg-white/[0.05]"
              >
                Preview
              </button>
              <div className="w-px h-4 bg-white/[0.06]" />
              <button onClick={(e) => { e.stopPropagation(); navigateProject(-1); }} className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ChevronLeft size={14} /></button>
              <button onClick={(e) => { e.stopPropagation(); navigateProject(1); }} className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ChevronRight size={14} /></button>
              {activeProject.url !== "#" && (
                <a href={activeProject.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><ExternalLink size={14} /></a>
              )}
              <div className="w-px h-4 bg-white/[0.06]" />
              <button onClick={(e) => { e.stopPropagation(); closeViewer(); }} className="p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50"><X size={14} /></button>
            </div>
          )}

          {/* Expanding container */}
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
            <div data-viewer-inner className="w-full h-full relative overflow-y-auto">
              {/* ─── DEEP DIVE MODE ─── */}
              {deepDiveMode ? (
                <DeepDiveContent
                  project={activeProject}
                  brandData={brandData}
                />
              ) : (
                /* ─── DEFAULT PREVIEW MODE ─── */
                <>
                  {activeProject.iframeable && !iframeLoaded && !iframeError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: brandData?.themeColor || "rgba(255,255,255,0.4)" }} />
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <p className="text-sm text-white/40 font-medium">Loading preview</p>
                        <p className="text-[10px] font-mono text-white/20 tracking-wider">
                          {(activeProject.previewUrl || activeProject.url).replace(/^https?:\/\//, "")}
                        </p>
                      </div>
                    </div>
                  )}
                  {activeProject.iframeable && !iframeError && (
                    <iframe
                      src={activeProject.previewUrl || activeProject.url}
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
                      {activeProject.thumbnail ? (
                        <div className="w-[80%] max-w-2xl rounded-xl overflow-hidden relative" style={{ border: "1px solid rgba(255,255,255,0.05)" }}>
                          <img src={activeProject.thumbnail} alt={activeProject.title} className="w-full h-auto" />
                        </div>
                      ) : (
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
                      )}
                      {activeProject.url !== "#" && (
                        <a
                          href={activeProject.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2.5 px-6 py-3 rounded-lg text-sm font-medium text-white/80 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                        >
                          Visit {activeProject.url.replace(/^https?:\/\//, "")} <ArrowUpRight size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Context panel — desktop (hidden in deep-dive mode) */}
          {!deepDiveMode && (
            <div
              data-context-panel
              className="absolute top-12 bottom-0 right-0 w-72 hidden md:flex flex-col p-5 overflow-y-auto z-10"
              style={{ background: "rgba(12, 12, 20, 0.95)", borderLeft: "1px solid rgba(255,255,255,0.05)" }}
            >
              {/* Brand identity strip */}
              {brandData?.ogImage && (
                <div className="rounded-lg overflow-hidden mb-4" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                  <img src={brandData.ogImage} alt="" className="w-full h-auto" />
                </div>
              )}

              <span className="text-[10px] font-mono tracking-wider uppercase text-white/20 mb-4 block">{activeProject.year}</span>
              <h3 className="text-lg font-bold text-white mb-0.5 tracking-tight">{activeProject.title}</h3>
              <p className="text-white/25 text-sm mb-4">{activeProject.subtitle}</p>
              <p className="text-white/35 text-sm leading-relaxed mb-5">{activeProject.description}</p>

              {/* Brand-scraped extra description */}
              {brandData?.description && brandData.description !== activeProject.description && (
                <div className="mb-5">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-white/15 block mb-2">From site</span>
                  <p className="text-white/20 text-xs leading-relaxed italic">&ldquo;{brandData.description}&rdquo;</p>
                </div>
              )}

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
          )}

          {/* Mobile bottom sheet */}
          <div
            data-mobile-sheet
            className="md:hidden absolute bottom-0 left-0 right-0 p-4 max-h-[40vh] overflow-y-auto z-10"
            style={{ background: "rgba(12, 12, 20, 0.95)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {brandData?.favicon && (
                  <img src={brandData.favicon} alt="" className="w-4 h-4 rounded-sm" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
                <div>
                  <h3 className="text-base font-bold text-white">{activeProject.title}</h3>
                  <p className="text-white/25 text-sm">{activeProject.subtitle}</p>
                </div>
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
