"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";

interface TestimonialRow {
  id: number;
  name: string;
  text: string;
  avatarUrl: string | null;
  workplace: string | null;
  color: string;
  visible: boolean;
  createdAt: string;
}

export function TestimonialsEditor() {
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/testimonials");
    // Public endpoint only returns visible — we need all, so use a different approach
    // Actually we need an admin endpoint. Let's fetch all via the public GET and also pending ones
    // For now, let's add an admin query param
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Fetch all testimonials (admin needs to see pending too)
    fetch("/api/testimonials?all=true")
      .then(async (r) => {
        // If this returns only visible, we'll handle in the API
        const data = await r.json();
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggleVisibility = async (id: number, currentVisible: boolean) => {
    await fetch(`/api/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visible: !currentVisible }),
    });
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, visible: !currentVisible } : t))
    );
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((t) => t.id !== id));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "rgba(255,255,255,0.15)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  // Sort: pending first, then by date
  const sorted = [...items].sort((a, b) => {
    if (a.visible !== b.visible) return a.visible ? 1 : -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-mono tracking-wider uppercase text-white/40">
          Testimonials ({items.length})
        </h2>
        <div className="flex gap-3 text-[10px] font-mono text-white/20">
          <span>{items.filter((t) => !t.visible).length} pending</span>
          <span>{items.filter((t) => t.visible).length} approved</span>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/30 text-sm">No testimonials yet.</p>
          <p className="text-white/15 text-xs font-mono mt-2">
            Visitors can submit kind words from the site.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((t) => (
            <div
              key={t.id}
              className="rounded-xl p-4 flex gap-4 items-start"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${t.visible ? "rgba(255,255,255,0.06)" : "rgba(251,191,36,0.15)"}`,
              }}
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-semibold select-none"
                style={{ backgroundColor: t.color, color: "rgba(255,255,255,0.7)" }}
              >
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  t.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-bold text-white/70">{t.name}</span>
                  {t.workplace && (
                    <span className="text-[10px] font-mono text-white/20">{t.workplace}</span>
                  )}
                </div>
                <p className="text-sm text-white/40 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded"
                    style={{
                      background: t.visible ? "rgba(74,222,128,0.1)" : "rgba(251,191,36,0.1)",
                      color: t.visible ? "rgba(74,222,128,0.5)" : "rgba(251,191,36,0.5)",
                    }}
                  >
                    {t.visible ? "Approved" : "Pending"}
                  </span>
                  <span className="text-[10px] font-mono text-white/15">
                    {new Date(t.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleToggleVisibility(t.id, t.visible)}
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                  title={t.visible ? "Hide" : "Approve"}
                >
                  {t.visible ? (
                    <Eye size={14} className="text-green-400/40" />
                  ) : (
                    <EyeOff size={14} className="text-white/15" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                  title="Delete"
                >
                  <Trash2 size={14} className="text-white/15 hover:text-red-400/50" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
