"use client";

import { useRef, useEffect, useState } from "react";
import { FileText, Download, ChevronRight, X, BookOpen, Lightbulb, List, MessageCircle, Send } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundEngine } from "@/lib/sounds";

gsap.registerPlugin(ScrollTrigger);

interface GuideChapter {
  title: string;
  page: number;
}

interface GuideTakeaway {
  text: string;
}

interface Guide {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  chapters: number;
  pages: number;
  date: string;
  accent: string;
  pdf: string;
  topics: string[];
  toc?: GuideChapter[];
  takeaways?: GuideTakeaway[];
}

const guides: Guide[] = [
  {
    id: "why-context-matters",
    title: "Why Context Matters",
    subtitle: "A Practical Guide to Building with Claude",
    summary:
      "How 1 million tokens changes everything for brands, builders, and teams. Covers building brand profiles and context swipe files, copy-paste prompts for voice, dev, and client contexts, real-world agency workflows, and why the era of 'close enough' AI output is over.",
    chapters: 12,
    pages: 12,
    date: "March 2026",
    accent: "#d4a137",
    pdf: "/guides/why-context-matters.pdf",
    topics: ["Context Engineering", "Brand Profiles", "1M Tokens", "Agency Workflows"],
    toc: [
      { title: "The Context Problem", page: 3 },
      { title: "What 1M Tokens Means for Brands", page: 4 },
      { title: "Building Brand Profiles & Swipe Files", page: 5 },
      { title: "Copy-Paste: Brand Voice Profile", page: 6 },
      { title: "Copy-Paste: Technical / Dev Profile", page: 7 },
      { title: "Copy-Paste: Client Context File", page: 8 },
      { title: "The Writer Who Can't Write", page: 9 },
      { title: "The Developer Who Skips the Spec", page: 10 },
      { title: "Agent Teams: Parallel Work", page: 11 },
      { title: "Real-World Workflow: Agency Model", page: 12 },
    ],
    takeaways: [
      { text: "Context is what turns a general-purpose model into YOUR model" },
      { text: "With 1M tokens, load your entire brand ecosystem into one conversation" },
      { text: "Build reusable context swipe files — identity, voice, style rules, examples" },
      { text: "Opus 4.6 scores 76% on MRCR v2 across 1M tokens — 4x better retrieval" },
      { text: "The era of 'close enough' AI output is over" },
    ],
  },
  {
    id: "if-you-dont-know-ask",
    title: "If You Don't Know, Ask.",
    subtitle: "Context Engineering from Chaos to Clarity",
    summary:
      "How to turn brain dumps into structured briefs using Claude's interview process. Covers voice-to-text workflows, the interview method with stacked rounds, 5 ready-to-use interview prompts for creative, technical, brand, and product contexts, and building on the brief.",
    chapters: 12,
    pages: 12,
    date: "March 2026",
    accent: "#4ade80",
    pdf: "/guides/if-you-dont-know-ask.pdf",
    topics: ["Interview Method", "Voice-to-Text", "Brain Dumps", "Structured Briefs"],
    toc: [
      { title: "The Problem With Prompting", page: 3 },
      { title: "Voice to Text: The Best First Step", page: 4 },
      { title: "The Interview Method", page: 5 },
      { title: "Stacked Interviews: Creative Then Technical", page: 6 },
      { title: "Brain Dump to Brief in 5 Rounds", page: 7 },
      { title: "Prompt: The Creative Interview", page: 8 },
      { title: "Prompt: The Technical Interview", page: 9 },
      { title: "Prompt: The Brand & Copy Interview", page: 10 },
      { title: "Prompt: The Product / Feature Interview", page: 11 },
      { title: "The Universal Brain Dump Processor", page: 12 },
    ],
    takeaways: [
      { text: "The best prompt isn't a prompt at all — it's a conversation" },
      { text: "Voice captures 3x more raw material than typing" },
      { text: "Let Claude interview you in 5-10 question rounds, not 30 at once" },
      { text: "Each round gets sharper as Claude builds context from your answers" },
      { text: "Go from messy voice note to structured brief without writing a 'prompt'" },
    ],
  },
  {
    id: "let-them-cook",
    title: "Let Them Cook.",
    subtitle: "The Missing Manual for Multi-Agent Workflows",
    summary:
      "The complete playbook for Claude Code agent teams. Covers the architecture behind multi-agent systems, when to use subagents vs full teams, 5 battle-tested prompt patterns for parallel builds, debugging, and research sprints, plus token economics and real-world control strategies.",
    chapters: 16,
    pages: 16,
    date: "March 2026",
    accent: "#6366f1",
    pdf: "/guides/let-them-cook.pdf",
    topics: ["Agent Teams", "Claude Code", "Parallel Workflows", "Prompt Patterns"],
    toc: [
      { title: "Why One Agent Isn't Enough", page: 3 },
      { title: "The Architecture: How Agent Teams Work", page: 4 },
      { title: "Subagents vs Agent Teams", page: 5 },
      { title: "Setting It Up", page: 6 },
      { title: "The Context Stack", page: 7 },
      { title: "The 5 Plays That Actually Work", page: 8 },
      { title: "Prompt: Parallel Feature Build", page: 9 },
      { title: "Prompt: Multi-Lens Code Review", page: 10 },
      { title: "Prompt: Competing Hypothesis Debugging", page: 11 },
      { title: "Prompt: Research & Exploration Sprint", page: 12 },
      { title: "Prompt: Full-Stack Refactor", page: 13 },
      { title: "Controlling the Team", page: 14 },
      { title: "What Will Go Wrong (And How to Fix It)", page: 15 },
      { title: "Token Economics: Is It Worth It", page: 16 },
    ],
    takeaways: [
      { text: "One agent is a developer — a team of agents is an engineering org" },
      { text: "LLMs degrade as context grows — split work across focused agents" },
      { text: "The spawn prompt is everything — include files, patterns, and what done looks like" },
      { text: "Use subagents for independent tasks, teams when workers need to communicate" },
      { text: "Agent teams ship 3-5x faster on complex, multi-domain work" },
    ],
  },
];

function GuideCard({
  guide,
  index,
  onSelect,
}: {
  guide: Guide;
  index: number;
  onSelect: (guide: Guide) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      data-guide-card
      className="group relative rounded-xl overflow-hidden cursor-pointer transform-gpu"
      style={{
        background: "rgba(12,12,20,0.5)",
        border: "1px solid rgba(255,255,255,0.05)",
        transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
      }}
      onClick={() => {
        soundEngine.play("cardClick");
        onSelect(guide);
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = guide.accent + "30";
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.3), 0 0 60px ${guide.accent}08`;
        soundEngine.playThrottled("cardHover", 150);
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(255,255,255,0.05)";
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Top accent line */}
      <div
        className="h-[2px] w-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${guide.accent}60, transparent)` }}
      />

      {/* Cover preview — dark card mimicking the PDF cover style */}
      <div className="relative px-6 pt-8 pb-6" style={{ minHeight: "200px" }}>
        {/* Accent glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[60%] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${guide.accent}10 0%, transparent 70%)`, filter: "blur(30px)" }}
        />

        {/* Number */}
        <span className="text-[80px] md:text-[100px] font-bold leading-none select-none pointer-events-none absolute top-4 right-6" style={{ color: `${guide.accent}08` }}>
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight mb-2 relative z-[1]">
          {guide.title}
        </h3>
        <p className="text-sm text-white/25 font-light mb-4 relative z-[1]">{guide.subtitle}</p>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[10px] font-mono tracking-wider uppercase text-white/15 relative z-[1]">
          <span>{guide.chapters} chapters</span>
          <span className="w-1 h-1 rounded-full bg-white/10" />
          <span>{guide.date}</span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-6 pb-5 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {guide.topics.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full text-white/20"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              {t}
            </span>
          ))}
        </div>
        <ChevronRight size={14} className="text-white/0 group-hover:text-white/30 transition-all duration-300 group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}

function GuideViewer({ guide, onClose }: { guide: Guide; onClose: () => void }) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [sideTab, setSideTab] = useState<"summary" | "chapters" | "takeaways" | "comments">("summary");

  // Comments state
  interface Comment { id: number; name: string; text: string; chapter: string | null; createdAt: string; }
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentName, setCommentName] = useState("");
  const [nameConfirmed, setNameConfirmed] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentChapter, setCommentChapter] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Fetch comments
  useEffect(() => {
    fetch(`/api/guides/comments?slug=${guide.id}`)
      .then((r) => r.json())
      .then((d) => { if (d.comments) setComments(d.comments); })
      .catch(() => {});
  }, [guide.id]);

  const submitComment = async () => {
    if (!commentName.trim() || !commentText.trim() || commentSubmitting) return;
    setCommentSubmitting(true);
    let visitorId = localStorage.getItem("visitor-id");
    if (!visitorId) { visitorId = crypto.randomUUID(); localStorage.setItem("visitor-id", visitorId); }

    try {
      const res = await fetch("/api/guides/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guideSlug: guide.id, chapter: commentChapter || null, name: commentName.trim(), text: commentText.trim(), visitorId }),
      });
      if (res.ok) {
        const c = await res.json();
        setComments((prev) => [c, ...prev]);
        setCommentText("");
        setCommentChapter("");
        setCommentSuccess(true);
        soundEngine.play("success");
        setTimeout(() => setCommentSuccess(false), 3000);
      }
    } catch {}
    setCommentSubmitting(false);
  };

  useEffect(() => {
    if (viewerRef.current) {
      gsap.fromTo(viewerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power3.out" });
    }
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const [pdfPage, setPdfPage] = useState(1);

  const navigateToPage = (page: number) => {
    if (!iframeRef.current) return;
    soundEngine.play("click");
    setPdfPage(page);
    // Use a unique query param to force the browser to treat this as a new navigation
    iframeRef.current.src = `${guide.pdf}?p=${page}#page=${page}&toolbar=0&navpanes=0`;
  };

  return (
    <div ref={viewerRef} className="fixed inset-0 z-50 flex flex-col" style={{ opacity: 0 }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#050508]/97" onClick={onClose} />

      {/* Chrome bar */}
      <div
        className="relative z-10 flex items-center px-4 md:px-6 h-12 shrink-0"
        style={{ background: "rgba(12,12,20,0.95)", borderBottom: `1px solid ${guide.accent}15` }}
      >
        <div className="w-2 h-2 rounded-full mr-3 shrink-0" style={{ background: guide.accent, boxShadow: `0 0 8px ${guide.accent}50` }} />
        <span className="text-sm font-semibold text-white truncate">{guide.title}</span>
        <span className="text-[10px] font-mono text-white/15 ml-3 hidden sm:inline tracking-wider">{guide.chapters} chapters</span>
        <div className="flex-1" />
        <a
          href={guide.pdf}
          download
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium text-white/40 hover:text-white/60 transition-colors mr-2"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          onClick={(e) => { e.stopPropagation(); soundEngine.play("click"); }}
        >
          <Download size={12} />
          <span className="hidden sm:inline">Download</span>
        </a>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors text-white/25 hover:text-white/50">
          <X size={16} />
        </button>
      </div>

      {/* Main content — PDF left, sidebar right */}
      <div className="relative z-10 flex-1 flex overflow-hidden">
        {/* PDF viewer — left/center */}
        <div className="flex-1 relative" style={{ background: "rgba(8,8,14,0.95)" }}>
          {/* Inner border glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ border: `1px solid ${guide.accent}08` }} />
          <iframe
            ref={iframeRef}
            src={`${guide.pdf}#toolbar=0&navpanes=0`}
            className="w-full h-full border-0"
            title={guide.title}
            style={{ background: "#0a0a0f" }}
          />
        </div>

        {/* Sidebar — right panel */}
        <div
          className="hidden md:flex flex-col w-80 lg:w-96 shrink-0 overflow-hidden"
          style={{ background: "rgba(10,10,16,0.98)", borderLeft: `1px solid ${guide.accent}12` }}
        >
          {/* Sidebar tabs */}
          <div className="flex shrink-0 px-4 pt-4 pb-0 gap-1">
            {([
              { key: "summary" as const, icon: BookOpen, label: "Summary" },
              { key: "chapters" as const, icon: List, label: "Chapters" },
              { key: "takeaways" as const, icon: Lightbulb, label: "Key Ideas" },
              { key: "comments" as const, icon: MessageCircle, label: `${comments.length || ""}` },
            ]).map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => { setSideTab(key); soundEngine.play("click"); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all duration-300"
                style={{
                  background: sideTab === key ? `${guide.accent}12` : "transparent",
                  color: sideTab === key ? guide.accent : "rgba(255,255,255,0.2)",
                  border: sideTab === key ? `1px solid ${guide.accent}20` : "1px solid transparent",
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Accent separator */}
          <div className="mx-4 mt-3 h-px" style={{ background: `linear-gradient(90deg, ${guide.accent}20, transparent)` }} />

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {/* SUMMARY */}
            {sideTab === "summary" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight mb-1">{guide.title}</h3>
                  <p className="text-sm text-white/25 font-light">{guide.subtitle}</p>
                </div>

                <p className="text-[13px] text-white/40 leading-[1.8]">{guide.summary}</p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Chapters", value: String(guide.chapters) },
                    { label: "Pages", value: String(guide.pages) },
                    { label: "Published", value: guide.date },
                    { label: "Author", value: "Henry Nicholson" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/15 mb-1">{m.label}</div>
                      <div className="text-sm text-white/50 font-medium">{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5">
                  {guide.topics.map((t) => (
                    <span key={t} className="text-[9px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full text-white/20" style={{ background: `${guide.accent}08`, border: `1px solid ${guide.accent}15` }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CHAPTERS */}
            {sideTab === "chapters" && guide.toc && (
              <div className="space-y-1">
                {guide.toc.map((ch, i) => {
                  const isActive = pdfPage === ch.page;
                  return (
                  <button
                    key={i}
                    onClick={() => navigateToPage(ch.page)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left group transition-all duration-200 hover:translate-x-0.5"
                    style={{ background: isActive ? `${guide.accent}10` : "transparent", border: isActive ? `1px solid ${guide.accent}18` : "1px solid transparent" }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = `${guide.accent}08`;
                      soundEngine.playThrottled("tick", 80);
                    }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span className={`text-[10px] font-mono w-5 shrink-0 tabular-nums ${isActive ? "" : "text-white/15"}`} style={isActive ? { color: guide.accent } : {}}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-[13px] transition-colors flex-1 ${isActive ? "text-white/70" : "text-white/35 group-hover:text-white/60"}`}>{ch.title}</span>
                    <span className={`text-[9px] font-mono transition-colors ${isActive ? "text-white/30" : "text-white/10 group-hover:text-white/25"}`}>p.{ch.page}</span>
                  </button>
                  );
                })}
              </div>
            )}

            {/* TAKEAWAYS */}
            {sideTab === "takeaways" && guide.takeaways && (
              <div className="space-y-3">
                <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/15 mb-4">Key ideas from this guide</p>
                {guide.takeaways.map((t, i) => (
                  <div
                    key={i}
                    className="relative pl-5 py-2.5 rounded-lg group"
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${guide.accent}06`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {/* Accent dot */}
                    <div className="absolute left-0 top-[14px] w-2 h-2 rounded-full" style={{ background: `${guide.accent}40` }} />
                    <p className="text-[13px] text-white/40 leading-[1.7] group-hover:text-white/55 transition-colors">{t.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* COMMENTS */}
            {sideTab === "comments" && (
              <div className="space-y-4">
                {/* Comment form */}
                <div className="space-y-2 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/15 mb-3">Leave a note</p>
                  {!nameConfirmed ? (
                    <div className="flex gap-2">
                      <input
                        value={commentName}
                        onChange={(e) => setCommentName(e.target.value)}
                        placeholder="Your name"
                        className="flex-1 rounded-lg px-3 py-2.5 text-sm text-white outline-none"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        onKeyDown={(e) => { if (e.key === "Enter" && commentName.trim()) setNameConfirmed(true); }}
                      />
                      {commentName.trim() && (
                        <button
                          onClick={() => setNameConfirmed(true)}
                          className="px-3 rounded-lg text-xs text-white/40 hover:text-white/60 transition-colors"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-white/40">{commentName}</span>
                      <button onClick={() => { setNameConfirmed(false); }} className="text-[9px] text-white/15 hover:text-white/30">(change)</button>
                    </div>
                  )}
                  {nameConfirmed && (
                    <>
                      {guide.toc && (
                        <select
                          value={commentChapter}
                          onChange={(e) => setCommentChapter(e.target.value)}
                          className="w-full rounded-lg px-3 py-2 text-xs text-white/40 outline-none appearance-none cursor-pointer"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                          <option value="">General comment</option>
                          {guide.toc.map((ch, i) => (
                            <option key={i} value={ch.title}>{ch.title}</option>
                          ))}
                        </select>
                      )}
                      <div className="flex gap-2">
                        <input
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="What did you find useful?"
                          maxLength={500}
                          className="flex-1 rounded-lg px-3 py-2.5 text-sm text-white outline-none"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                          onKeyDown={(e) => { if (e.key === "Enter") submitComment(); }}
                        />
                        <button
                          onClick={submitComment}
                          disabled={!commentText.trim() || commentSubmitting}
                          className="px-3 rounded-lg transition-all duration-200 disabled:opacity-20"
                          style={{ background: `${guide.accent}15`, border: `1px solid ${guide.accent}25` }}
                        >
                          <Send size={13} style={{ color: guide.accent }} />
                        </button>
                      </div>
                      {commentSuccess && (
                        <p className="text-[11px] text-green-400/50" style={{ fontFamily: "var(--font-caveat)" }}>Posted!</p>
                      )}
                    </>
                  )}
                </div>

                {/* Comments list */}
                {comments.length === 0 ? (
                  <p className="text-xs text-white/15 text-center py-8">No comments yet. Be the first.</p>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[12px] font-semibold text-white/45">{c.name}</span>
                        {c.chapter && (
                          <span className="text-[9px] font-mono text-white/15 px-1.5 py-0.5 rounded" style={{ background: `${guide.accent}08`, border: `1px solid ${guide.accent}10` }}>
                            {c.chapter}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-white/30 leading-[1.7]">{c.text}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="shrink-0 px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <a
              href={guide.pdf}
              download
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: `${guide.accent}12`, border: `1px solid ${guide.accent}20` }}
              onClick={() => soundEngine.play("click")}
            >
              <Download size={14} />
              Download Full PDF
            </a>
          </div>
        </div>

        {/* Mobile bottom sheet — shows summary + download only */}
        <div
          className="md:hidden absolute bottom-0 left-0 right-0 z-10 px-4 py-4 space-y-3"
          style={{ background: "rgba(10,10,16,0.95)", borderTop: `1px solid ${guide.accent}15`, backdropFilter: "blur(16px)" }}
        >
          <p className="text-[12px] text-white/30 leading-relaxed line-clamp-2">{guide.summary}</p>
          <a
            href={guide.pdf}
            download
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium text-white/70"
            style={{ background: `${guide.accent}12`, border: `1px solid ${guide.accent}20` }}
          >
            <Download size={14} />
            Download PDF
          </a>
        </div>
      </div>
    </div>
  );
}

// Lookup map for enrichment data (toc, takeaways) that lives in code, not DB
const enrichmentMap = new Map(guides.map((g) => [g.id, { toc: g.toc, takeaways: g.takeaways }]));

export function GuidesSection({ dbGuides }: { dbGuides?: Guide[] } = {}) {
  // Merge DB data with hardcoded enrichment (toc, takeaways)
  const guidesData = dbGuides && dbGuides.length > 0
    ? dbGuides.map((g) => {
        const enrichment = enrichmentMap.get(g.id);
        return { ...g, toc: g.toc || enrichment?.toc, takeaways: g.takeaways || enrichment?.takeaways };
      })
    : guides;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 0, y: 24 });
        ScrollTrigger.create({
          trigger: headerRef.current,
          start: "top 82%",
          onEnter: () => {
            gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
            soundEngine.playThrottled("sectionEnter", 800);
          },
          once: true,
        });
      }

      const cards = sectionRef.current?.querySelectorAll("[data-guide-card]");
      if (cards?.length) {
        gsap.set(cards, { y: 40, opacity: 0 });
        ScrollTrigger.create({
          trigger: cards[0],
          start: "top 80%",
          onEnter: () => {
            gsap.to(cards, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: "power3.out" });
          },
          once: true,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} data-section="guides" className="py-10 md:py-20">
      <div className="w-[90vw] max-w-5xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Workflows & Guides
          </h2>
          <p className="mt-3 text-white/25 text-sm md:text-base max-w-lg mx-auto">
            Free playbooks on context engineering, AI agent teams, and building with Claude.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {guidesData.map((guide, i) => (
            <GuideCard key={guide.id} guide={guide} index={i} onSelect={setSelectedGuide} />
          ))}
        </div>
      </div>

      {/* Viewer overlay */}
      {selectedGuide && (
        <GuideViewer guide={selectedGuide} onClose={() => { setSelectedGuide(null); soundEngine.play("close"); }} />
      )}
    </section>
  );
}
