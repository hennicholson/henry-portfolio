"use client";

/*
 * Light half of the voice feature. The context shape is unchanged, so
 * voice-bubble / voice-cta / call-summary consume it exactly as before —
 * but the ElevenLabs/LiveKit stack now lives in voice-engine.tsx, which
 * only loads when a visitor shows intent (hover) or starts a call.
 */

import { createContext, useCallback, useContext, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { VoiceEngineApi } from "./voice-engine";

const VoiceEngine = dynamic(
  () => import("./voice-engine").then((m) => m.VoiceEngine),
  { ssr: false },
);

type VoiceStatus = "connected" | "disconnected" | "connecting" | "error";

export interface CallSummaryData {
  sectionsVisited: string[];
  projectsViewed: string[];
  durationSeconds: number;
  capturedName: string | null;
  capturedEmail: string | null;
}

interface VoiceContextValue {
  status: VoiceStatus;
  isSpeaking: boolean;
  startConversation: () => Promise<void>;
  endConversation: () => Promise<void>;
  callSummary: CallSummaryData | null;
  dismissSummary: () => void;
  /** Mounts the engine (loads the SDK chunk) without starting a call. */
  warm: () => void;
}

const VoiceContext = createContext<VoiceContextValue>({
  status: "disconnected",
  isSpeaking: false,
  startConversation: async () => {},
  endConversation: async () => {},
  callSummary: null,
  dismissSummary: () => {},
  warm: () => {},
});

export function useVoice() {
  return useContext(VoiceContext);
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const agentId = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID;

  const [engineWanted, setEngineWanted] = useState(false);
  const [status, setStatus] = useState<VoiceStatus>("disconnected");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callSummary, setCallSummary] = useState<CallSummaryData | null>(null);

  const engineApi = useRef<VoiceEngineApi | null>(null);
  const pendingStart = useRef(false);

  const dismissSummary = useCallback(() => setCallSummary(null), []);
  const warm = useCallback(() => setEngineWanted(true), []);

  const startConversation = useCallback(async () => {
    if (!agentId) return;
    setEngineWanted(true);
    if (engineApi.current) {
      await engineApi.current.start();
    } else {
      // engine chunk still loading — start as soon as it announces itself
      pendingStart.current = true;
    }
  }, [agentId]);

  const endConversation = useCallback(async () => {
    await engineApi.current?.end();
  }, []);

  const onReady = useCallback((api: VoiceEngineApi) => {
    engineApi.current = api;
    if (pendingStart.current) {
      pendingStart.current = false;
      api.start();
    }
  }, []);

  const onState = useCallback((s: { status: string; isSpeaking: boolean }) => {
    setStatus(s.status as VoiceStatus);
    setIsSpeaking(s.isSpeaking);
  }, []);

  return (
    <VoiceContext.Provider
      value={{
        status,
        isSpeaking,
        startConversation,
        endConversation,
        callSummary,
        dismissSummary,
        warm,
      }}
    >
      {children}
      {agentId && engineWanted && (
        <VoiceEngine
          agentId={agentId}
          onReady={onReady}
          onState={onState}
          onSummary={setCallSummary}
        />
      )}
    </VoiceContext.Provider>
  );
}
