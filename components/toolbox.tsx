"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundEngine } from "@/lib/sounds";
import "./toolbox.css";

gsap.registerPlugin(ScrollTrigger);

interface ToolData {
  name: string;
  note: string;
  logoUrl?: string | null;
}

interface CategoryData {
  label: string;
  tools: ToolData[];
}

const fallbackCategories: CategoryData[] = [
  {
    label: "AI",
    tools: [
      { name: "Claude", note: "Reasoning", logoUrl: "/logos/claude.svg" },
      { name: "GPT", note: "Generation", logoUrl: "/logos/gpt.svg" },
      { name: "Gemini", note: "Multimodal", logoUrl: "/logos/gemini.svg" },
      { name: "Kling", note: "Video", logoUrl: "/logos/kling.svg" },
      { name: "Seedance", note: "Video", logoUrl: "/logos/seedance.svg" },
      { name: "Runway", note: "Video", logoUrl: "/logos/runway.svg" },
    ],
  },
  {
    label: "Build",
    tools: [
      { name: "React", note: "UI", logoUrl: "/logos/react.svg" },
      { name: "Next.js", note: "Framework", logoUrl: "/logos/nextjs.svg" },
      { name: "TypeScript", note: "Language", logoUrl: "/logos/typescript.svg" },
      { name: "Node.js", note: "Runtime", logoUrl: "/logos/nodejs.svg" },
      { name: "Tailwind", note: "Styling", logoUrl: "/logos/tailwind.svg" },
      { name: "GSAP", note: "Animation", logoUrl: "/logos/gsap.svg" },
    ],
  },
  {
    label: "Ship",
    tools: [
      { name: "Vercel", note: "Hosting", logoUrl: "/logos/vercel.svg" },
      { name: "Netlify", note: "Edge", logoUrl: "/logos/netlify.svg" },
      { name: "Supabase", note: "Database", logoUrl: "/logos/supabase.svg" },
      { name: "Neon", note: "Database", logoUrl: "/logos/neon.svg" },
      { name: "Whop", note: "Payments", logoUrl: "/logos/whop.svg" },
      { name: "GitHub", note: "Source", logoUrl: "/logos/github.svg" },
    ],
  },
  {
    label: "Create",
    tools: [
      { name: "Photoshop", note: "Design", logoUrl: "/logos/photoshop.svg" },
      { name: "Figma", note: "Design", logoUrl: "/logos/figma.svg" },
      { name: "Remotion", note: "Motion Graphics", logoUrl: "/logos/remotion.svg" },
      { name: "CapCut", note: "Edit", logoUrl: "/logos/capcut.svg" },
      { name: "CapCut Studio", note: "Studio", logoUrl: "/logos/capcut.svg" },
      { name: "Canva", note: "Quick", logoUrl: "/logos/canva.svg" },
    ],
  },
];

function ToolChip({ tool }: { tool: ToolData }) {
  return (
    <div className="tb__tool">
      {tool.logoUrl && (
        <Image
          src={tool.logoUrl}
          alt=""
          width={18}
          height={18}
          className="tb__tool-logo"
        />
      )}
      <span className="tb__tool-text">
        <span className="tb__tool-name">{tool.name}</span>
        <span className="tb__tool-note">{tool.note}</span>
      </span>
    </div>
  );
}

function Drawer({
  category,
  index,
  isOpen,
  onToggle,
}: {
  category: CategoryData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    if (isOpen) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.45,
        ease: "power3.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.inOut",
      });
    }
  }, [isOpen]);

  return (
    <div ref={drawerRef} data-drawer className="tb__row">
      <button
        type="button"
        className="tb__toggle"
        aria-expanded={isOpen}
        aria-controls={`tb-panel-${index}`}
        onClick={onToggle}
      >
        <span className="tb__label">{category.label}</span>
        <span className="tb__count">{String(category.tools.length).padStart(2, "0")}</span>
        <svg
          className="tb__chev"
          width="11"
          height="11"
          viewBox="0 0 10 10"
          aria-hidden="true"
        >
          <path
            d="M2 3.5L5 6.5L8 3.5"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div
        ref={contentRef}
        id={`tb-panel-${index}`}
        className="tb__panel"
        style={{ height: 0, opacity: 0 }}
      >
        <div className="tb__grid">
          {category.tools.map((tool) => (
            <div key={tool.name} data-tool-item style={{ opacity: 0 }}>
              <ToolChip tool={tool} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Toolbox({ categories }: { categories?: CategoryData[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const data = categories || fallbackCategories;
  const [openDrawers, setOpenDrawers] = useState<Set<number>>(new Set());

  const toggleDrawer = (index: number) => {
    setOpenDrawers((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
        soundEngine.play("close");
      } else {
        next.add(index);
        soundEngine.play("open");
      }
      return next;
    });
  };

  // Animate tool items when drawer opens — scatter then snap into place
  useEffect(() => {
    if (!sectionRef.current) return;
    const drawers = sectionRef.current.querySelectorAll("[data-drawer]");
    drawers.forEach((drawer, idx) => {
      if (openDrawers.has(idx)) {
        const items = drawer.querySelectorAll<HTMLElement>("[data-tool-item]");
        items.forEach((item, itemIdx) => {
          gsap.set(item, { y: 8, opacity: 0 });
          gsap.to(item, {
            y: 0,
            opacity: 1,
            duration: 0.32,
            delay: itemIdx * 0.03,
            ease: "power3.out",
          });
        });
      }
    });
  }, [openDrawers]);

  // Scroll-triggered entrance
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-tb-header]", {
        scrollTrigger: { trigger: "[data-tb-header]", start: "top 85%", once: true },
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: "power3.out",
      });

      gsap.from("[data-tb-box]", {
        scrollTrigger: { trigger: "[data-tb-box]", start: "top 85%", once: true },
        opacity: 0,
        y: 40,
        rotateX: -5,
        duration: 0.9,
        ease: "power3.out",
        onComplete: () => {
          setOpenDrawers(new Set([0]));
        },
      });

      // Post-it note
      const note = sectionRef.current!.querySelector("[data-tb-note]");
      if (note) {
        gsap.set(note, { opacity: 0, x: 50, rotation: 8, scale: 0.8 });
        ScrollTrigger.create({
          trigger: note,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(note, {
              opacity: 1, x: 0, rotation: 3, scale: 1,
              duration: 0.7, ease: "back.out(1.6)", delay: 0.5,
            });
            gsap.to(note, {
              opacity: 0, x: 30, rotation: 6, scale: 0.9,
              duration: 0.5, ease: "power2.in", delay: 6.5,
            });
          },
        });
      }

      // Stagger drawer entrances
      const drawers = sectionRef.current!.querySelectorAll("[data-drawer]");
      drawers.forEach((drawer, idx) => {
        gsap.from(drawer, {
          scrollTrigger: { trigger: drawer, start: "top 90%", once: true },
          opacity: 0,
          x: idx % 2 === 0 ? -20 : 20,
          duration: 0.5,
          delay: idx * 0.08,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [data]);

  // Subtle 3D tilt on mouse move
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = box.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rotateY = ((e.clientX - centerX) / rect.width) * 3;
      const rotateX = ((e.clientY - centerY) / rect.height) * -2;

      gsap.to(box, {
        rotateX,
        rotateY,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(box, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
      });
    };

    box.addEventListener("mousemove", handleMouseMove);
    box.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      box.removeEventListener("mousemove", handleMouseMove);
      box.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <section ref={sectionRef} className="tb" data-section="stack">
      <div className="tb__wrap">
        <div data-tb-header className="tb__head">
          <h2 className="tb__title">The Toolbox</h2>
          <p className="tb__lede">
            What I actually reach for — {data.reduce((n, c) => n + c.tools.length, 0)} tools
            across {data.length} disciplines. Open a drawer.
          </p>
        </div>

        <div ref={boxRef} data-tb-box className="tb__list">
          {data.map((category, index) => (
            <Drawer
              key={category.label}
              category={category}
              index={index}
              isOpen={openDrawers.has(index)}
              onToggle={() => toggleDrawer(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
