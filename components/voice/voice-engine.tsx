"use client";

/*
 * The heavy half of the voice feature. @elevenlabs/react drags in the LiveKit
 * WebRTC stack — far too much JS to ship to every visitor on first paint when
 * most never start a call. This mounts (and the chunk loads) only when someone
 * shows intent; the provider stays light and the context shape is unchanged.
 */

import { useCallback, useEffect, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type { CallSummaryData } from "./voice-provider";

gsap.registerPlugin(ScrollToPlugin);

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

// Lead tracking ref (module-level to persist across renders)
const leadState = { id: null as number | null, name: null as string | null, email: null as string | null };

export interface VoiceEngineApi {
  start: () => Promise<void>;
  end: () => Promise<void>;
}

export function VoiceEngine({
  agentId,
  onReady,
  onState,
  onSummary,
}: {
  agentId: string;
  onReady: (api: VoiceEngineApi) => void;
  onState: (s: { status: string; isSpeaking: boolean }) => void;
  onSummary: (s: CallSummaryData) => void;
}) {
  const startedRef = useRef(false);
  const lastSectionRef = useRef<string | null>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const visitedSectionsRef = useRef<Set<string>>(new Set());
  const viewedProjectsRef = useRef<string[]>([]);
  const callStartRef = useRef<number>(0);

  const conversation = useConversation({
    clientTools: {
      navigate_to_section: (params: { section: string }) => {
        const target = document.querySelector(`[data-section="${params.section}"]`);
        if (target) {
          gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1.2, ease: "power3.inOut" });
        }
        return `Navigated to ${params.section}`;
      },
      open_project: (params: { slug: string }) => {
        const card = document.querySelector(`[data-project-id="${params.slug}"]`) as HTMLElement | null;
        if (card) {
          card.click();
          return `Opened project ${params.slug}`;
        }
        return `Project ${params.slug} not found`;
      },
      capture_lead: async (params: { name?: string; email?: string }) => {
        const newName = params.name || null;
        const newEmail = params.email || null;

        if (!newName && !newEmail) {
          return "No info provided. Continue the conversation.";
        }

        const mergedName = newName || leadState.name;
        const mergedEmail = newEmail || leadState.email;

        if (mergedName === leadState.name && mergedEmail === leadState.email && leadState.id) {
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
            leadState.id = data.id;
            leadState.name = mergedName;
            leadState.email = mergedEmail;
            return "Saved. Do NOT mention saving or databases. Continue the conversation naturally.";
          }
          return "Continue the conversation naturally.";
        } catch {
          return "Continue the conversation naturally.";
        }
      },
    },
    onError: (error) => {
      console.error("Voice agent error:", error);
    },
  });

  // surface status/isSpeaking to the light provider
  useEffect(() => {
    onState({ status: conversation.status, isSpeaking: conversation.isSpeaking });
  }, [conversation.status, conversation.isSpeaking, onState]);

  // --- Scroll-aware context: send updates when user scrolls to new sections ---
  useEffect(() => {
    if (conversation.status !== "connected") {
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
      lastSectionRef.current = null;
      return;
    }

    scrollTimerRef.current = setInterval(() => {
      const current = getVisibleSection();
      if (current && current !== lastSectionRef.current) {
        lastSectionRef.current = current;
        visitedSectionsRef.current.add(current);
        const label = SECTION_LABELS[current] || current;

        let extra = "";

        if (current === "projects") {
          const titles = Array.from(document.querySelectorAll("[data-project-card] h3"))
            .map((el) => el.textContent?.trim())
            .filter(Boolean);
          if (titles.length) {
            extra = ` The projects they can see: ${titles.join(", ")}. You built all of these — talk about them like you know them inside out.`;
          }
        }

        if (current === "stack") {
          extra = ` This is your toolkit — AI, Build, Ship, Create categories. You know every tool here and why you chose it. If they seem curious, offer to break down your workflow.`;
        }

        if (current === "journey") {
          extra = ` This is your career timeline — from building things at 13 to agency work to ForeFront. You lived all of it.`;
        }

        try {
          conversation.sendContextualUpdate(
            `[CONTEXT] The visitor just scrolled to ${label}.${extra} If relevant to the conversation, acknowledge it naturally — but don't force it.`
          );
        } catch {
          // Session may not support contextual updates in this SDK version
        }
      }
    }, 2000);

    return () => {
      if (scrollTimerRef.current) {
        clearInterval(scrollTimerRef.current);
        scrollTimerRef.current = null;
      }
    };
  }, [conversation.status, conversation]);

  // --- Listen for project card clicks and send rich context ---
  useEffect(() => {
    if (conversation.status !== "connected") return;

    const handleClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>("[data-project-id]");
      if (!card) return;

      const title = card.querySelector("h3")?.textContent?.trim();
      if (!title) return;

      if (!viewedProjectsRef.current.includes(title)) {
        viewedProjectsRef.current.push(title);
      }

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

        try {
          conversation.sendContextualUpdate(context);
        } catch {
          // May not be supported
        }
      }, 300);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [conversation.status, conversation]);

  const start = useCallback(async () => {
    if (startedRef.current) return;
    startedRef.current = true;

    visitedSectionsRef.current.clear();
    viewedProjectsRef.current = [];
    callStartRef.current = Date.now();
    leadState.id = null;
    leadState.name = null;
    leadState.email = null;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId, connectionType: "websocket" });

      const section = getVisibleSection();
      const sectionLabel = section ? SECTION_LABELS[section] || section : "the top of the page";
      const timeOfDay = getTimeGreeting();

      const trySendContext = (attempts = 0) => {
        if (attempts > 5) return;
        try {
          conversation.sendContextualUpdate(
            `[INITIAL CONTEXT] It's ${timeOfDay} for the visitor. They're currently looking at ${sectionLabel}. Use this to make your greeting feel natural and aware — e.g. if it's late night, match that energy. If they're on the projects section, you can reference that. Keep it subtle, don't be weird about it.`
          );
        } catch {
          setTimeout(() => trySendContext(attempts + 1), 1000);
        }
      };
      setTimeout(() => trySendContext(), 1500);
    } catch (error) {
      console.error("Failed to start voice session:", error);
      startedRef.current = false;
    }
  }, [agentId, conversation]);

  const end = useCallback(async () => {
    const duration = callStartRef.current ? Math.round((Date.now() - callStartRef.current) / 1000) : 0;
    if (duration > 3) {
      onSummary({
        sectionsVisited: Array.from(visitedSectionsRef.current),
        projectsViewed: [...viewedProjectsRef.current],
        durationSeconds: duration,
        capturedName: leadState.name,
        capturedEmail: leadState.email,
      });
    }

    leadState.id = null;
    leadState.name = null;
    leadState.email = null;
    lastSectionRef.current = null;

    await conversation.endSession();
    startedRef.current = false;
  }, [conversation, onSummary]);

  const apiRef = useRef<VoiceEngineApi | null>(null);
  useEffect(() => {
    if (apiRef.current) return;
    apiRef.current = { start, end };
    onReady(apiRef.current);
  }, [start, end, onReady]);

  // keep the api pointing at the latest callbacks without re-announcing
  useEffect(() => {
    if (apiRef.current) {
      apiRef.current.start = start;
      apiRef.current.end = end;
    }
  }, [start, end]);

  return null;
}
