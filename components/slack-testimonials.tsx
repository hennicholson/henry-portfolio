'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Reaction {
  emoji: string;
  count: number;
}

interface Message {
  id: number;
  author: string;
  initials: string;
  color: string;
  timestamp: string;
  text: string;
  reactions: Reaction[];
  thread?: {
    replies: number;
    lastReply: string;
  };
}

const messages: Message[] = [
  {
    id: 1,
    author: 'Sarah Chen',
    initials: 'SC',
    color: 'rgb(59, 130, 246)', // blue
    timestamp: '2:34 PM',
    text: "Henry brings a rare combination of technical skill and creative vision. He doesn't just build things — he builds the right things, fast.",
    reactions: [
      { emoji: '🔥', count: 3 },
      { emoji: '💯', count: 2 },
    ],
    thread: {
      replies: 3,
      lastReply: '2:45 PM',
    },
  },
  {
    id: 2,
    author: 'Alex Rivera',
    initials: 'AR',
    color: 'rgb(168, 85, 247)', // purple
    timestamp: '3:12 PM',
    text: "ForeFront changed how I think about AI. Henry made something complex feel approachable and actually useful for students like me.",
    reactions: [
      { emoji: '🙌', count: 5 },
      { emoji: '❤️', count: 4 },
    ],
  },
  {
    id: 3,
    author: 'Jordan Lee',
    initials: 'JL',
    color: 'rgb(34, 197, 94)', // green
    timestamp: '4:56 PM',
    text: "Context Engineering is the one newsletter I actually read every week. Clear, practical, no fluff. Henry has a gift for making AI tangible.",
    reactions: [
      { emoji: '💡', count: 6 },
      { emoji: '📚', count: 2 },
      { emoji: '👏', count: 3 },
    ],
  },
];

export default function SlackTestimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const typingRef = useRef<HTMLDivElement>(null);
  const [hoveredReaction, setHoveredReaction] = useState<string | null>(null);
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      // 1. Channel header animation
      tl.from(headerRef.current, {
        y: -16,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });

      // 2. Messages with stagger
      messagesRef.current.forEach((message, index) => {
        if (message) {
          tl.from(
            message,
            {
              y: 30,
              opacity: 0,
              duration: 0.7,
              ease: 'power3.out',
            },
            index === 0 ? '-=0.3' : '-=0.55'
          );

          // 3. Reactions for this message (start 0.3s after message starts)
          const reactions = message.querySelectorAll('[data-reaction]');
          tl.from(
            reactions,
            {
              scale: 0.6,
              opacity: 0,
              duration: 0.4,
              ease: 'elastic.out(1, 0.4)',
              stagger: 0.08,
            },
            `-=0.4`
          );
        }
      });

      // 4. Typing indicator sequence
      tl.add(() => setShowTyping(true), '+=0.2');
      tl.from(
        typingRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power3.out',
        },
        '-=0'
      );

      // Hold typing indicator for 1.5s then fade out
      tl.to(
        typingRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: 'power3.in',
        },
        '+=1.5'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="testimonials"
      className="py-14 md:py-20"
      style={{ backgroundColor: '#050508' }}
    >
      <div className="w-[90vw] max-w-5xl mx-auto px-6">
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(12, 12, 20, 0.9) 0%, rgba(8, 8, 14, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {/* Channel Header */}
          <div
            ref={headerRef}
            className="px-5 md:px-6 py-4 md:py-5"
            style={{
              backgroundColor: 'rgba(12, 12, 20, 0.95)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <h2 className="text-lg md:text-xl font-bold" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                # what-people-say
              </h2>
              <span className="text-sm md:text-base" style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
                Testimonials & kind words
              </span>
            </div>
            <div className="font-mono text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.2)' }}>
              3 members · 📌 3 pinned items
            </div>
          </div>

          {/* Messages */}
          <div className="px-5 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
            {messages.map((message, index) => (
              <div
                key={message.id}
                ref={(el) => {
                  messagesRef.current[index] = el;
                }}
                className="flex gap-3 md:gap-4"
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-medium text-sm"
                  style={{
                    backgroundColor: message.color,
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {message.initials}
                </div>

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  {/* Author & Timestamp */}
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-sm md:text-base" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {message.author}
                    </span>
                    <span className="font-mono text-xs md:text-sm" style={{ color: 'rgba(255, 255, 255, 0.15)' }}>
                      {message.timestamp}
                    </span>
                  </div>

                  {/* Message Text */}
                  <p
                    className="text-sm md:text-[15px] leading-relaxed mb-3"
                    style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                  >
                    {message.text}
                  </p>

                  {/* Reactions */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2">
                    {message.reactions.map((reaction, rIndex) => {
                      const reactionKey = `${message.id}-${rIndex}`;
                      const isHovered = hoveredReaction === reactionKey;

                      return (
                        <button
                          key={rIndex}
                          data-reaction
                          className="px-2 py-1 rounded-md text-xs md:text-sm inline-flex items-center gap-1.5 transition-all duration-200"
                          style={{
                            backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                            border: `1px solid ${isHovered ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.08)'}`,
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                          }}
                          onMouseEnter={() => setHoveredReaction(reactionKey)}
                          onMouseLeave={() => setHoveredReaction(null)}
                        >
                          <span>{reaction.emoji}</span>
                          <span className="font-mono" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                            {reaction.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Thread Indicator */}
                  {message.thread && (
                    <button
                      className="text-xs md:text-sm font-medium transition-opacity duration-200 hover:opacity-80"
                      style={{ color: 'rgba(96, 165, 250, 0.6)' }}
                    >
                      {message.thread.replies} {message.thread.replies === 1 ? 'reply' : 'replies'} · Last reply {message.thread.lastReply}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {showTyping && (
              <div ref={typingRef} className="flex gap-3 md:gap-4">
                {/* Henry's Avatar */}
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-medium text-sm"
                  style={{
                    backgroundColor: 'rgb(59, 130, 246)',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  HN
                </div>

                {/* Typing Animation */}
                <div className="flex items-center gap-2 py-2">
                  <span className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                    typing
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        animationDelay: '0ms',
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        animationDelay: '150ms',
                      }}
                    />
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        animationDelay: '300ms',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
