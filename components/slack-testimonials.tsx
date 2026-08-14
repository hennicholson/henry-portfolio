"use client";

import { useEffect, useRef, useState } from "react";
import { Send, X, User } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { soundEngine } from "@/lib/sounds";

gsap.registerPlugin(ScrollTrigger);

interface TestimonialData {
  id?: number;
  name: string;
  text: string;
  avatarUrl?: string | null;
  workplace?: string | null;
  color: string;
}

const REACTION_EMOJIS = ["🔥", "💯", "🙌", "❤️", "👏", "✨"];

interface ReactionMap {
  [testimonialId: number]: { [emoji: string]: number };
}

interface MyReactions {
  [key: string]: boolean; // "testimonialId:emoji" -> true
}

function getVisitorId(): string {
  if (typeof localStorage === "undefined") return "anon";
  let id = localStorage.getItem("visitor-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor-id", id);
  }
  return id;
}

const fallbackMessages: TestimonialData[] = [
  {
    name: "Sarah Chen",
    text: "Henry brings a rare combination of technical skill and creative vision. He doesn\u2019t just build things \u2014 he builds the right things, fast.",
    color: "rgba(59, 130, 246, 0.25)",
  },
  {
    name: "Alex Rivera",
    text: "ForeFront changed how I think about AI. Henry made something complex feel approachable and actually useful for students like me.",
    color: "rgba(168, 85, 247, 0.25)",
  },
  {
    name: "Jordan Lee",
    text: "Context Engineering is the one newsletter I actually read every week. Clear, practical, no fluff. Henry has a gift for making AI tangible.",
    color: "rgba(34, 197, 94, 0.25)",
  },
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function TypingDots() {
  return (
    <div className="flex items-center gap-2 py-2">
      <span className="text-[11px] text-white/20">typing</span>
      <div className="flex gap-1">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="w-1.5 h-1.5 rounded-full bg-white/25 animate-pulse"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

function ReactionBar({
  msgId,
  reactions,
  myReactions,
  onReact,
  revealed,
}: {
  msgId: number;
  reactions: { [emoji: string]: number };
  myReactions: MyReactions;
  onReact: (testimonialId: number, emoji: string) => void;
  revealed: boolean;
}) {
  const [showPicker, setShowPicker] = useState(false);

  if (!revealed) return null;

  const activeReactions = Object.entries(reactions).filter(([, count]) => count > 0);

  return (
    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
      {/* Existing reaction pills */}
      {activeReactions.map(([emoji, count]) => {
        const isMine = myReactions[`${msgId}:${emoji}`];
        return (
          <button
            key={emoji}
            onClick={() => onReact(msgId, emoji)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: isMine ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${isMine ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <span>{emoji}</span>
            <span className={isMine ? "text-green-400/60 font-mono" : "text-white/25 font-mono"}>{count}</span>
          </button>
        );
      })}

      {/* Add reaction button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200 hover:scale-110"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <span className="text-white/15 text-[10px]">+</span>
        </button>

        {showPicker && (
          <div
            className="absolute bottom-full left-0 mb-1 flex gap-0.5 p-1 rounded-lg z-10"
            style={{
              background: "rgba(12,12,20,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
            }}
          >
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(msgId, emoji);
                  setShowPicker(false);
                }}
                className="w-9 h-9 flex items-center justify-center rounded hover:bg-white/[0.06] transition-all duration-150 hover:scale-125 text-sm"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageItem({
  msg,
  revealed,
  typing,
  reactions,
  myReactions,
  onReact,
}: {
  msg: TestimonialData;
  revealed: boolean;
  typing: boolean;
  reactions: { [emoji: string]: number };
  myReactions: MyReactions;
  onReact: (testimonialId: number, emoji: string) => void;
}) {
  return (
    <div className="flex gap-3 py-3 group/msg">
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-semibold select-none"
        style={{ backgroundColor: msg.color, color: "rgba(255,255,255,0.7)" }}
      >
        {msg.avatarUrl ? (
          <img src={msg.avatarUrl} alt="" className="w-full h-full rounded-lg object-cover" />
        ) : (
          getInitials(msg.name)
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="font-semibold text-[13px] text-white/60">{msg.name}</span>
          {msg.workplace && (
            <span className="text-[10px] font-mono text-white/15">{msg.workplace}</span>
          )}
        </div>

        {/* Typing overlay — same height as message */}
        <div className="relative">
          {typing && !revealed && (
            <div className="absolute inset-0 z-[1]">
              <TypingDots />
            </div>
          )}
          <p
            className="text-[13px] leading-relaxed text-white/35 transition-opacity duration-500"
            style={{ opacity: revealed ? 1 : 0 }}
          >
            {msg.text}
          </p>
        </div>

        {/* Reactions */}
        {msg.id && (
          <ReactionBar
            msgId={msg.id}
            reactions={reactions}
            myReactions={myReactions}
            onReact={onReact}
            revealed={revealed}
          />
        )}
      </div>
    </div>
  );
}

interface SubmitFormProps {
  messageText: string;
  onSubmit: (data: { name: string; avatarUrl?: string; workplace?: string }) => void;
  onCancel: () => void;
}

function SubmitForm({ messageText, onSubmit, onCancel }: SubmitFormProps) {
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [workplace, setWorkplace] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 10, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" }
      );
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      workplace: workplace.trim() || undefined,
    });
  };

  return (
    <div
      ref={formRef}
      className="absolute inset-0 z-20 flex items-center justify-center p-4"
      style={{
        background: "rgba(8, 8, 14, 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-white/30">
            Complete your message
          </span>
          <button type="button" onClick={onCancel} className="p-1 text-white/20 hover:text-white/40 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Preview */}
        <div
          className="rounded-lg px-3 py-2 text-[12px] text-white/25 leading-relaxed"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          &ldquo;{messageText}&rdquo;
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name *"
          required
          className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/15"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        />
        <input
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="Profile image URL (optional)"
          className="w-full rounded-lg px-3 py-2 text-xs font-mono text-white/40 outline-none transition-colors focus:border-white/15"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        />
        <input
          value={workplace}
          onChange={(e) => setWorkplace(e.target.value)}
          placeholder="Where you work (optional)"
          className="w-full rounded-lg px-3 py-2 text-xs text-white/30 outline-none transition-colors focus:border-white/15"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        />

        <button
          type="submit"
          className="w-full py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white/90 transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default function SlackTestimonials({
  testimonials,
}: {
  testimonials?: TestimonialData[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [revealedMessages, setRevealedMessages] = useState<Set<number>>(new Set());
  const [typingMessages, setTypingMessages] = useState<Set<number>>(new Set());
  const hasTriggered = useRef(false);

  const [inputText, setInputText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reactions, setReactions] = useState<ReactionMap>({});
  const [myReactions, setMyReactions] = useState<MyReactions>({});

  const messages = testimonials && testimonials.length > 0 ? testimonials : fallbackMessages;

  // Fetch reaction counts on mount
  useEffect(() => {
    const ids = messages.filter((m) => m.id).map((m) => m.id!);
    if (ids.length === 0) return;
    fetch(`/api/testimonials/react?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.counts) {
          const map: ReactionMap = {};
          for (const row of data.counts) {
            if (!map[row.testimonialId]) map[row.testimonialId] = {};
            map[row.testimonialId][row.emoji] = row.count;
          }
          setReactions(map);
        }
      })
      .catch(() => {});

    // Load my reactions from localStorage
    if (typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("my-reactions");
      if (stored) {
        try { setMyReactions(JSON.parse(stored)); } catch {}
      }
    }
  }, [messages.length]);

  const handleReact = async (testimonialId: number, emoji: string) => {
    const visitorId = getVisitorId();
    const key = `${testimonialId}:${emoji}`;
    const wasMine = myReactions[key];

    // Optimistic update
    setReactions((prev) => {
      const next = { ...prev };
      if (!next[testimonialId]) next[testimonialId] = {};
      const current = next[testimonialId][emoji] || 0;
      next[testimonialId] = { ...next[testimonialId], [emoji]: wasMine ? Math.max(0, current - 1) : current + 1 };
      return next;
    });

    const nextMyReactions = { ...myReactions };
    if (wasMine) {
      delete nextMyReactions[key];
    } else {
      nextMyReactions[key] = true;
    }
    setMyReactions(nextMyReactions);
    localStorage.setItem("my-reactions", JSON.stringify(nextMyReactions));

    soundEngine.play("pop");

    try {
      await fetch("/api/testimonials/react", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId, emoji, visitorId }),
      });
    } catch {}
  };

  // Scroll-triggered message reveal
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-board]", {
        scrollTrigger: { trigger: "[data-board]", start: "top 82%", once: true },
        opacity: 0,
        y: 30,
        duration: 0.7,
        ease: "power3.out",
      });

      ScrollTrigger.create({
        trigger: "[data-board]",
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (hasTriggered.current) return;
          hasTriggered.current = true;

          messages.forEach((_, i) => {
            setTimeout(() => {
              setTypingMessages((prev) => new Set(prev).add(i));
            }, i * 1200);

            setTimeout(() => {
              setTypingMessages((prev) => {
                const next = new Set(prev);
                next.delete(i);
                return next;
              });
              setRevealedMessages((prev) => new Set(prev).add(i));
              soundEngine.play("pop");
            }, i * 1200 + 700);
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [messages]);

  const handleSendClick = () => {
    if (!inputText.trim()) return;
    setShowForm(true);
  };

  const handleFormSubmit = async (data: { name: string; avatarUrl?: string; workplace?: string }) => {
    try {
      await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, text: inputText }),
      });
      setShowForm(false);
      setInputText("");
      setSubmitSuccess(true);
      soundEngine.play("success");
      setTimeout(() => setSubmitSuccess(false), 3500);
    } catch {
      // silently fail
    }
  };

  return (
    <section ref={sectionRef} data-section="testimonials" className="py-10 md:py-20">
      <div className="w-[90vw] max-w-5xl mx-auto px-4 md:px-6">
        {/* Section header */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            My Take on Testimonials
          </h2>
          <p className="mt-3 text-white/25 text-sm md:text-base max-w-lg mx-auto">
            Real words from people I&apos;ve worked with. Drop a message if you&apos;ve got something to say.
          </p>
        </div>

        <div
          data-board
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "rgba(12, 12, 20, 0.5)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {/* Inner glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 60%)",
            }}
          />

          {/* Header */}
          <div
            className="relative px-5 md:px-6 py-3.5 md:py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-base md:text-lg font-bold text-white/70">
                # kind-words
              </span>
              <span className="text-xs md:text-sm text-white/20 hidden sm:inline">
                Leave a message
              </span>
            </div>
            <div className="font-mono text-[11px] text-white/15">
              {messages.length} messages
            </div>
          </div>

          {/* Messages area — fixed height, no layout shift */}
          <div
            ref={messagesRef}
            className="relative px-5 md:px-6 overflow-y-auto"
            style={{ height: "340px" }}
          >
            <div className="divide-y divide-white/[0.03]">
              {messages.map((msg, index) => (
                <MessageItem
                  key={msg.id || index}
                  msg={msg}
                  revealed={revealedMessages.has(index)}
                  typing={typingMessages.has(index)}
                  reactions={msg.id ? reactions[msg.id] || {} : {}}
                  myReactions={myReactions}
                  onReact={handleReact}
                />
              ))}
            </div>
          </div>

          {/* Chat input — frosted separator */}
          <div
            className="relative px-5 md:px-6 py-3.5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
          >
            {submitSuccess ? (
              <div className="flex items-center justify-center py-2">
                <span
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-caveat)",
                    color: "rgba(74,222,128,0.5)",
                    fontSize: "15px",
                  }}
                >
                  Message sent! It&apos;ll appear after review.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  <User size={14} className="text-white/20" />
                </div>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendClick(); }}
                  placeholder="Leave some kind words..."
                  className="flex-1 bg-transparent text-sm text-white/50 placeholder-white/15 outline-none"
                />
                <button
                  onClick={handleSendClick}
                  disabled={!inputText.trim()}
                  className="p-2 rounded-lg transition-all duration-200 disabled:opacity-20"
                  style={{
                    background: inputText.trim() ? "rgba(255,255,255,0.06)" : "transparent",
                  }}
                >
                  <Send size={14} className="text-white/30" />
                </button>
              </div>
            )}
          </div>

          {/* Profile form overlay */}
          {showForm && (
            <SubmitForm
              messageText={inputText}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
