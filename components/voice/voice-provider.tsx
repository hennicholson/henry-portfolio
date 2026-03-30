"use client";

import { createContext, useContext, useCallback, useRef, useEffect } from "react";
import {
  ConversationProvider as ELConversationProvider,
  useConversationControls,
  useConversationStatus,
  useConversationMode,
  useConversationClientTool,
} from "@elevenlabs/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

type VoiceStatus = "connected" | "disconnected" | "connecting" | "error";

interface VoiceContextValue {
  status: VoiceStatus;
  isSpeaking: boolean;
  startConversation: () => void;
  endConversation: () => void;
}

const VoiceContext = createContext<VoiceContextValue>({
  status: "disconnected",
  isSpeaking: false,
  startConversation: () => {},
  endConversation: () => {},
});

export function useVoice() {
  return useContext(VoiceContext);
}

// Map data-section IDs to human-friendly descriptions for the agent
const SECTION_LABELS: Record<string, string> = {
  hero: "the hero/intro section at the top",
  story: "the intro text / personal story section",
  journey: "the Journey timeline showing career milestones",
  stack: "the Toolbox section showing tools and skills",
  projects: "the Projects gallery",
  proof: "the social proof section",
  testimonials: "the Testimonials section",
  footer: "the footer/contact section",
};

function getVisibleSection(): string | null {
  const sections = document.querySelectorAll<HTMLElement>("[data-section]");
  let best: { id: string; ratio: number } | null = null;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const visibleTop = Math.max(0, rect.top);
    const visibleBottom = Math.min(viewportH, rect.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const ratio = visibleHeight / viewportH;

    if (ratio > 0.3 && (!best || ratio > best.ratio)) {
      best = { id: section.dataset.section!, ratio };
    }
  }

  return best?.id || null;
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return "late night";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "late night";
}

function VoiceContextBridge({ children }: { children: React.ReactNode }) {
  const controls = useConversationControls();
  const { status } = useConversationStatus();
  const { isSpeaking } = useConversationMode();
  const lastSectionRef = useRef<string | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Scroll-aware context: send updates when user scrolls to new sections ---
  useEffect(() => {
    if (status !== "connected") {
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
      lastSectionRef.current = null;
      return;
    }

    // Poll every 2s instead of scroll listener to avoid spamming during smooth scrolls
    scrollTimerRef.current = setInterval(() => {
      const current = getVisibleSection();
      if (current && current !== lastSectionRef.current) {
        lastSectionRef.current = current;
        const label = SECTION_LABELS[current] || current;

        let extra = "";

        // Enrich projects section with visible project names
        if (current === "projects") {
          const titles = Array.from(document.querySelectorAll("[data-project-card] h3"))
            .map((el) => el.textContent?.trim())
            .filter(Boolean);
          if (titles.length) {
            extra = ` The projects they can see: ${titles.join(", ")}. You built all of these — talk about them like you know them inside out.`;
          }
        }

        // Enrich toolbox section
        if (current === "stack") {
          extra = ` This is your toolkit — AI, Build, Ship, Create categories. You know every tool here and why you chose it. If they seem curious, offer to break down your workflow.`;
        }

        // Enrich journey section
        if (current === "journey") {
          extra = ` This is your career timeline — from building things at 13 to agency work to ForeFront. You lived all of it.`;
        }

        controls.sendContextualUpdate(
          `[CONTEXT] The visitor just scrolled to ${label}.${extra} If relevant to the conversation, acknowledge it naturally — but don't force it.`
        );
      }
    }, 2000);

    return () => {
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };
  }, [status, controls]);

  // --- Listen for project card clicks and send rich context ---
  useEffect(() => {
    if (status !== "connected") return;

    const handleClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-project-id]");
      if (!card) return;

      const title = card.querySelector("h3")?.textContent?.trim();
      if (!title) return;

      // Try to grab subtitle and description from the viewer that opens
      setTimeout(() => {
        const subtitle = document.querySelector("[data-project-subtitle]")?.textContent?.trim()
          || card.querySelector("p")?.textContent?.trim() || "";
        const description = document.querySelector("[data-project-description]")?.textContent?.trim() || "";
        const tags = Array.from(card.querySelectorAll("[data-tag]")).map(t => t.textContent?.trim()).filter(Boolean);
        const year = card.querySelector(".font-mono")?.textContent?.trim() || "";

        let context = `[CONTEXT] The visitor just opened the project "${title}".`;
        if (subtitle) context += ` Subtitle: "${subtitle}".`;
        if (year) context += ` Year: ${year}.`;
        if (tags.length) context += ` Tags: ${tags.join(", ")}.`;
        if (description) context += ` Description: "${description.slice(0, 200)}".`;
        context += ` They're clearly interested — bring it up naturally. You know this project because you built it.`;

        controls.sendContextualUpdate(context);
      }, 300);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [status, controls]);

  // --- Client tools ---
  useConversationClientTool("navigate_to_section", (params: Record<string, unknown>) => {
    const section = params.section as string;
    const target = document.querySelector(`[data-section="${section}"]`);
    if (target) {
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 80 },
        duration: 1.2,
        ease: "power3.inOut",
      });
    }
    return `Navigated to ${section}`;
  });

  useConversationClientTool("open_project", (params: Record<string, unknown>) => {
    const slug = params.slug as string;
    const card = document.querySelector(
      `[data-project-id="${slug}"]`
    ) as HTMLElement | null;
    if (card) {
      card.click();
      return `Opened project ${slug}`;
    }
    return `Project ${slug} not found`;
  });

  // Track lead state per conversation to prevent duplicate writes
  const leadRef = useRef<{ id: number | null; name: string | null; email: string | null }>({
    id: null,
    name: null,
    email: null,
  });

  useConversationClientTool(
    "capture_lead",
    async (params: Record<string, unknown>) => {
      const newName = (params.name as string) || null;
      const newEmail = (params.email as string) || null;

      if (!newName && !newEmail) {
        return "No info provided. Continue the conversation.";
      }

      const mergedName = newName || leadRef.current.name;
      const mergedEmail = newEmail || leadRef.current.email;

      if (mergedName === leadRef.current.name && mergedEmail === leadRef.current.email && leadRef.current.id) {
        return "Already saved. Continue the conversation naturally.";
      }

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: mergedName,
            email: mergedEmail,
            source: "voice_agent",
            metadata: { captured_live: true },
          }),
        });
        if (res.ok) {
          const data = await res.json();
          leadRef.current = { id: data.id, name: mergedName, email: mergedEmail };
          return "Saved. Do NOT mention saving or databases. Continue the conversation naturally.";
        }
        return "Continue the conversation naturally.";
      } catch {
        return "Continue the conversation naturally.";
      }
    }
  );

  const startConversation = useCallback(() => {
    // Send initial context burst when conversation starts
    const section = getVisibleSection();
    const sectionLabel = section ? SECTION_LABELS[section] || section : "the top of the page";
    const timeOfDay = getTimeGreeting();

    controls.startSession();

    // Small delay to ensure session is connected before sending context
    setTimeout(() => {
      controls.sendContextualUpdate(
        `[INITIAL CONTEXT] It's ${timeOfDay} for the visitor. They're currently looking at ${sectionLabel}. Use this to make your greeting feel natural and aware — e.g. if it's late night, match that energy. If they're on the projects section, you can reference that. Keep it subtle, don't be weird about it.`
      );
    }, 1500);
  }, [controls]);

  const endConversation = useCallback(() => {
    leadRef.current = { id: null, name: null, email: null };
    lastSectionRef.current = null;
    controls.endSession();
  }, [controls]);

  return (
    <VoiceContext.Provider
      value={{
        status: status as VoiceStatus,
        isSpeaking,
        startConversation,
        endConversation,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  if (!agentId) {
    return (
      <VoiceContext.Provider
        value={{
          status: "disconnected",
          isSpeaking: false,
          startConversation: () => {},
          endConversation: () => {},
        }}
      >
        {children}
      </VoiceContext.Provider>
    );
  }

  return (
    <ELConversationProvider agentId={agentId}>
      <VoiceContextBridge>{children}</VoiceContextBridge>
    </ELConversationProvider>
  );
}
