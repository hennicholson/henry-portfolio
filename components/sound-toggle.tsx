"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeOff } from "lucide-react";
import { soundEngine } from "@/lib/sounds";

export function SoundToggle() {
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    soundEngine.hydrate();
    setMuted(soundEngine.muted);
    return soundEngine.subscribe(() => setMuted(soundEngine.muted));
  }, []);

  return (
    <button
      onClick={() => soundEngine.toggle()}
      className="fixed bottom-6 left-6 z-40 p-3 rounded-full transition-all duration-300 group"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      aria-label={muted ? "Enable sounds" : "Mute sounds"}
      title={muted ? "Enable sounds" : "Mute sounds"}
    >
      {muted ? (
        <VolumeOff size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
      ) : (
        <Volume2 size={16} className="text-white/40 group-hover:text-white/60 transition-colors" />
      )}
    </button>
  );
}
