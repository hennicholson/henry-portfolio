"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Search, ArrowUpRight, Hash, Briefcase, Link2, Sparkles, Copy, Check } from "lucide-react";

gsap.registerPlugin(ScrollToPlugin);

interface PaletteItem {
  id: string;
  label: string;
  category: "section" | "project" | "link" | "action";
  icon: typeof Hash;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const scrollToSection = useCallback((id: string) => {
    setOpen(false);
    if (id === "hero") {
      gsap.to(window, { scrollTo: { y: 0 }, duration: 1.2, ease: "power3.inOut" });
      return;
    }
    const el = document.querySelector(`[data-section="${id}"]`);
    if (el) gsap.to(window, { scrollTo: { y: el, offsetY: 80 }, duration: 1.2, ease: "power3.inOut" });
  }, []);

  const openProject = useCallback((id: string) => {
    setOpen(false);
    // Scroll to projects section, then click the card
    const card = document.querySelector(`[data-project-id="${id}"]`) as HTMLElement;
    if (card) {
      gsap.to(window, {
        scrollTo: { y: card, offsetY: 200 },
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => { card.click(); },
      });
    }
  }, []);

  const copyEmail = useCallback(() => {
    navigator.clipboard.writeText("henry@example.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const items: PaletteItem[] = [
    { id: "s-intro", label: "Go to Intro", category: "section", icon: Hash, action: () => scrollToSection("hero") },
    { id: "s-story", label: "Go to Story", category: "section", icon: Hash, action: () => scrollToSection("story") },
    { id: "s-journey", label: "Go to Journey", category: "section", icon: Hash, action: () => scrollToSection("journey") },
    { id: "s-stack", label: "Go to Stack", category: "section", icon: Hash, action: () => scrollToSection("stack") },
    { id: "s-work", label: "Go to Work", category: "section", icon: Hash, action: () => scrollToSection("projects") },
    { id: "s-proof", label: "Go to Testimonials", category: "section", icon: Hash, action: () => scrollToSection("proof") },
    { id: "s-connect", label: "Go to Connect", category: "section", icon: Hash, action: () => scrollToSection("footer") },

    { id: "p-launchpad", label: "Open LaunchPad", category: "project", icon: Briefcase, action: () => openProject("launchpad") },
    { id: "p-forefront", label: "Open ForeFront USD", category: "project", icon: Briefcase, action: () => openProject("forefront-usd") },
    { id: "p-skinny", label: "Open Skinny Studio", category: "project", icon: Briefcase, action: () => openProject("skinny-studio") },
    { id: "p-slop", label: "Open Slop.design", category: "project", icon: Briefcase, action: () => openProject("slop-design") },
    { id: "p-adventures", label: "Open Adventures in AI", category: "project", icon: Briefcase, action: () => openProject("adventures-in-ai") },
    { id: "p-video", label: "Open AI Video Production", category: "project", icon: Briefcase, action: () => openProject("ai-video-production") },

    { id: "l-github", label: "GitHub", category: "link", icon: Link2, action: () => { setOpen(false); window.open("#", "_blank"); } },
    { id: "l-linkedin", label: "LinkedIn", category: "link", icon: Link2, action: () => { setOpen(false); window.open("#", "_blank"); } },
    { id: "l-twitter", label: "Twitter / X", category: "link", icon: Link2, action: () => { setOpen(false); window.open("#", "_blank"); } },

    { id: "a-email", label: copied ? "Email Copied!" : "Copy Email", category: "action", icon: copied ? Check : Copy, action: copyEmail },
    { id: "a-party", label: "Party Mode \u{1F389}", category: "action", icon: Sparkles, action: () => { setOpen(false); window.dispatchEvent(new CustomEvent("party-mode")); } },
  ];

  const filtered = query
    ? items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
        return;
      }

      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, selectedIndex]);

  // Reset selected index when filter changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      if (backdropRef.current) gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.15 });
      if (modalRef.current) gsap.fromTo(modalRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "power3.out" });
    }
  }, [open]);

  // Hide hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHintVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const categoryLabels: Record<string, string> = {
    section: "Sections",
    project: "Projects",
    link: "Links",
    action: "Actions",
  };

  // Group filtered items by category
  const grouped = filtered.reduce<Record<string, PaletteItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  let flatIndex = 0;

  return (
    <>
      {/* ⌘K Hint badge */}
      <div
        className="fixed bottom-6 left-6 z-30 hidden md:flex items-center gap-1 px-2 py-1 rounded transition-opacity duration-1000"
        style={{
          opacity: hintVisible ? 1 : 0,
          pointerEvents: hintVisible ? "auto" : "none",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <span className="text-[9px] font-mono text-white/15">&#8984;K</span>
      </div>

      {/* Palette modal */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          <div
            ref={backdropRef}
            className="absolute inset-0"
            style={{ background: "rgba(5, 5, 8, 0.8)" }}
            onClick={() => setOpen(false)}
          />

          <div
            ref={modalRef}
            className="relative mx-auto mt-[18vh] w-[90vw] max-w-lg rounded-xl overflow-hidden"
            style={{
              background: "#0a0a0f",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
            }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Search size={14} className="text-white/20 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search sections, projects, actions..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/15"
              />
              <kbd className="text-[9px] font-mono text-white/15 px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="text-center text-white/15 text-sm py-8">No results found.</p>
              )}

              {Object.entries(grouped).map(([category, categoryItems]) => (
                <div key={category}>
                  <p className="px-4 pt-3 pb-1 text-[9px] font-mono tracking-[0.2em] uppercase text-white/15">
                    {categoryLabels[category] || category}
                  </p>
                  {categoryItems.map((item) => {
                    const currentIndex = flatIndex++;
                    const isSelected = currentIndex === selectedIndex;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left transition-colors duration-100"
                        style={{
                          background: isSelected ? "rgba(255,255,255,0.04)" : "transparent",
                        }}
                      >
                        <Icon size={14} className={isSelected ? "text-white/40" : "text-white/15"} />
                        <span className={`text-sm ${isSelected ? "text-white/70" : "text-white/30"}`}>
                          {item.label}
                        </span>
                        {item.category === "link" && (
                          <ArrowUpRight size={10} className="ml-auto text-white/10" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 flex items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[9px] font-mono text-white/10">
                <kbd className="px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>&uarr;&darr;</kbd> navigate
              </span>
              <span className="text-[9px] font-mono text-white/10">
                <kbd className="px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>&crarr;</kbd> select
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
