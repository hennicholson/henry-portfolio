"use client";

import { createContext, useContext, useCallback, useRef } from "react";
import { useConversation } from "@elevenlabs/react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

type VoiceStatus = "connected" | "disconnected" | "connecting";

interface VoiceContextValue {
  status: VoiceStatus;
  isSpeaking: boolean;
  startConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
}

const VoiceContext = createContext<VoiceContextValue>({
  status: "disconnected",
  isSpeaking: false,
  startConversation: async () => {},
  endConversation: async () => {},
});

export function useVoice() {
  return useContext(VoiceContext);
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;
  const startedRef = useRef(false);

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
    },
    onError: (error) => {
      console.error("Voice agent error:", error);
    },
  });

  const startConversation = useCallback(async () => {
    if (!agentId || startedRef.current) return;
    startedRef.current = true;

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({ agentId, connectionType: "websocket" });
    } catch (error) {
      console.error("Failed to start voice session:", error);
      startedRef.current = false;
    }
  }, [agentId, conversation]);

  const endConversation = useCallback(async () => {
    await conversation.endSession();
    startedRef.current = false;
  }, [conversation]);

  return (
    <VoiceContext.Provider
      value={{
        status: conversation.status as VoiceStatus,
        isSpeaking: conversation.isSpeaking,
        startConversation,
        endConversation,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
}
