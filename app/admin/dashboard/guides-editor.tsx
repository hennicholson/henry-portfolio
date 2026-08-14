"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical, Plus, Trash2, Eye, EyeOff, Save, Check,
  MessageCircle, ChevronDown, ChevronUp, FileText, ExternalLink,
} from "lucide-react";

interface GuideRow {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  chapters: number;
  pages: number;
  date: string;
  accent: string;
  pdfUrl: string;
  topics: string[];
  toc: { title: string; page: number }[];
  takeaways: { text: string }[];
  sortOrder: number;
  visible: boolean;
}

const inputClass = "w-full rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-white/15";
const inputStyle = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" };
const labelClass = "text-[10px] font-mono tracking-[0.15em] uppercase text-white/25 mb-1.5 block";

function SortableGuide({
  guide,
  onChange,
  onDelete,
  onSave,
}: {
  guide: GuideRow;
  onChange: (id: number, field: string, value: unknown) => void;
  onDelete: (id: number) => void;
  onSave: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: guide.id });
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onSave(guide.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-xl mb-3 overflow-hidden"
    >
      {/* ── Collapsed header ── */}
      <div
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer"
        style={{
          background: expanded ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.015)",
          border: `1px solid ${expanded ? guide.accent + "20" : "rgba(255,255,255,0.05)"}`,
          borderBottom: expanded ? "none" : undefined,
          borderRadius: expanded ? "12px 12px 0 0" : "12px",
          transition: "all 0.2s ease",
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <button {...attributes} {...listeners} className="cursor-grab text-white/15 hover:text-white/30 touch-none" onClick={(e) => e.stopPropagation()}>
          <GripVertical size={16} />
        </button>

        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: guide.accent, boxShadow: `0 0 8px ${guide.accent}40` }} />

        <div className="flex-1 min-w-0">
          <span className="text-sm font-semibold text-white block truncate">{guide.title || "Untitled Guide"}</span>
          <span className="text-[10px] text-white/20 font-mono">{guide.slug} &middot; {guide.chapters} ch &middot; {guide.visible ? "visible" : "hidden"}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => onChange(guide.id, "visible", !guide.visible)} className="p-2 rounded-lg text-white/20 hover:text-white/40 hover:bg-white/[0.04] transition-colors">
            {guide.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button onClick={handleSave} className="p-2 rounded-lg text-white/20 hover:text-white/40 hover:bg-white/[0.04] transition-colors">
            {saved ? <Check size={14} className="text-green-400/70" /> : <Save size={14} />}
          </button>
          <button onClick={() => onDelete(guide.id)} className="p-2 rounded-lg text-white/20 hover:text-red-400/60 hover:bg-white/[0.04] transition-colors">
            <Trash2 size={14} />
          </button>
        </div>

        {expanded ? <ChevronUp size={14} className="text-white/15" /> : <ChevronDown size={14} className="text-white/15" />}
      </div>

      {/* ── Expanded editor ── */}
      {expanded && (
        <div
          className="px-5 py-5 space-y-5"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${guide.accent}20`,
            borderTop: "none",
            borderRadius: "0 0 12px 12px",
          }}
        >
          {/* Live preview card */}
          <div
            className="rounded-xl p-5 relative overflow-hidden"
            style={{
              background: "rgba(12,12,20,0.5)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${guide.accent}60, transparent)` }} />
            <span className="text-[9px] font-mono tracking-wider uppercase text-white/15 block mb-1">Live Preview</span>
            <h3 className="text-lg font-bold text-white tracking-tight">{guide.title || "Guide Title"}</h3>
            <p className="text-xs text-white/25 mt-0.5">{guide.subtitle || "Subtitle"}</p>
            <div className="flex gap-1.5 mt-3">
              {guide.topics.map((t) => (
                <span key={t} className="text-[8px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full text-white/20" style={{ background: `${guide.accent}10`, border: `1px solid ${guide.accent}15` }}>{t}</span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-3 text-[9px] font-mono text-white/15">
              <span>{guide.chapters} chapters</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>{guide.pages} pages</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>{guide.date}</span>
            </div>
          </div>

          {/* ── Title & Subtitle ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Title</label>
              <input value={guide.title} onChange={(e) => onChange(guide.id, "title", e.target.value)} placeholder="Guide title" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass}>Subtitle</label>
              <input value={guide.subtitle} onChange={(e) => onChange(guide.id, "subtitle", e.target.value)} placeholder="Short description" className={inputClass} style={inputStyle} />
            </div>
          </div>

          {/* ── Slug ── */}
          <div>
            <label className={labelClass}>Slug (URL identifier)</label>
            <input value={guide.slug} onChange={(e) => onChange(guide.id, "slug", e.target.value)} placeholder="my-guide-slug" className={`${inputClass} font-mono text-xs text-white/40`} style={inputStyle} />
          </div>

          {/* ── Summary ── */}
          <div>
            <label className={labelClass}>Summary</label>
            <textarea
              value={guide.summary}
              onChange={(e) => onChange(guide.id, "summary", e.target.value)}
              placeholder="Full summary of the guide content..."
              rows={4}
              className={`${inputClass} resize-none text-white/60`}
              style={inputStyle}
            />
            <span className="text-[9px] text-white/10 mt-1 block">{guide.summary.length} characters</span>
          </div>

          {/* ── Numbers row ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={labelClass}>Chapters</label>
              <input type="number" value={guide.chapters} onChange={(e) => onChange(guide.id, "chapters", parseInt(e.target.value) || 0)} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass}>Pages</label>
              <input type="number" value={guide.pages} onChange={(e) => onChange(guide.id, "pages", parseInt(e.target.value) || 0)} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input value={guide.date} onChange={(e) => onChange(guide.id, "date", e.target.value)} placeholder="March 2026" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className={labelClass}>Accent Color</label>
              <div className="flex items-center gap-2">
                <input value={guide.accent} onChange={(e) => onChange(guide.id, "accent", e.target.value)} placeholder="#hex" className={`${inputClass} font-mono text-xs text-white/40 flex-1`} style={inputStyle} />
                <input type="color" value={guide.accent} onChange={(e) => onChange(guide.id, "accent", e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent shrink-0" />
              </div>
            </div>
          </div>

          {/* ── PDF URL ── */}
          <div>
            <label className={labelClass}>PDF File Path</label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FileText size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/15" />
                <input value={guide.pdfUrl} onChange={(e) => onChange(guide.id, "pdfUrl", e.target.value)} placeholder="/guides/my-guide.pdf" className={`${inputClass} font-mono text-xs text-white/40 pl-9`} style={inputStyle} />
              </div>
              {guide.pdfUrl && (
                <a href={guide.pdfUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 rounded-lg text-[10px] text-white/25 hover:text-white/40 transition-colors shrink-0" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <ExternalLink size={12} /> Preview
                </a>
              )}
            </div>
            <span className="text-[9px] text-white/10 mt-1 block">Upload PDF to <code className="text-white/20">public/guides/</code> then enter the path here</span>
          </div>

          {/* ── Topics ── */}
          <div>
            <label className={labelClass}>Topics (comma-separated)</label>
            <input
              value={guide.topics.join(", ")}
              onChange={(e) => onChange(guide.id, "topics", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              placeholder="Context Engineering, Brand Profiles, Claude"
              className={inputClass}
              style={inputStyle}
            />
          </div>

          {/* ── Table of Contents ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Chapters (Table of Contents)</label>
              <button
                onClick={() => onChange(guide.id, "toc", [...guide.toc, { title: "", page: guide.toc.length + 1 }])}
                className="text-[9px] font-mono text-white/20 hover:text-white/40 px-2 py-1 rounded transition-colors"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                + Add chapter
              </button>
            </div>
            <div className="space-y-1.5">
              {guide.toc.map((ch, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/15 w-6 text-right shrink-0">{String(i + 1).padStart(2, "0")}</span>
                  <input
                    value={ch.title}
                    onChange={(e) => {
                      const next = [...guide.toc];
                      next[i] = { ...next[i], title: e.target.value };
                      onChange(guide.id, "toc", next);
                    }}
                    placeholder="Chapter title"
                    className="flex-1 rounded-lg px-3 py-2 text-xs text-white outline-none"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={ch.page}
                    onChange={(e) => {
                      const next = [...guide.toc];
                      next[i] = { ...next[i], page: parseInt(e.target.value) || 1 };
                      onChange(guide.id, "toc", next);
                    }}
                    className="w-16 rounded-lg px-2 py-2 text-xs font-mono text-white/40 text-center outline-none"
                    style={inputStyle}
                    placeholder="pg"
                  />
                  <button
                    onClick={() => {
                      const next = guide.toc.filter((_, j) => j !== i);
                      onChange(guide.id, "toc", next);
                    }}
                    className="p-1.5 text-white/10 hover:text-red-400/50 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
              {guide.toc.length === 0 && (
                <p className="text-[10px] text-white/10 py-2">No chapters added yet.</p>
              )}
            </div>
          </div>

          {/* ── Key Takeaways ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={labelClass}>Key Takeaways</label>
              <button
                onClick={() => onChange(guide.id, "takeaways", [...guide.takeaways, { text: "" }])}
                className="text-[9px] font-mono text-white/20 hover:text-white/40 px-2 py-1 rounded transition-colors"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                + Add takeaway
              </button>
            </div>
            <div className="space-y-1.5">
              {guide.takeaways.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: `${guide.accent}40` }} />
                  <input
                    value={t.text}
                    onChange={(e) => {
                      const next = [...guide.takeaways];
                      next[i] = { text: e.target.value };
                      onChange(guide.id, "takeaways", next);
                    }}
                    placeholder="Key idea or takeaway"
                    className="flex-1 rounded-lg px-3 py-2 text-xs text-white/50 outline-none"
                    style={inputStyle}
                  />
                  <button
                    onClick={() => {
                      const next = guide.takeaways.filter((_, j) => j !== i);
                      onChange(guide.id, "takeaways", next);
                    }}
                    className="p-1.5 text-white/10 hover:text-red-400/50 transition-colors"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}
              {guide.takeaways.length === 0 && (
                <p className="text-[10px] text-white/10 py-2">No takeaways added yet.</p>
              )}
            </div>
          </div>

          {/* ── Save bar ── */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[9px] text-white/10 font-mono">ID: {guide.id} &middot; Order: {guide.sortOrder}</span>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: `${guide.accent}15`, border: `1px solid ${guide.accent}25`, color: guide.accent }}
            >
              {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentsManager({ guideSlugs }: { guideSlugs: string[] }) {
  interface CommentRow { id: number; guideSlug: string; chapter: string | null; name: string; text: string; createdAt: string; }
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [slugFilter, setSlugFilter] = useState("");

  useEffect(() => {
    if (guideSlugs.length === 0) { setLoading(false); return; }
    Promise.all(
      guideSlugs.map((slug) => fetch(`/api/guides/comments?slug=${slug}`).then(r => r.json()))
    ).then((results) => {
      const all = results.flatMap((r) => r.comments || []);
      all.sort((x: CommentRow, y: CommentRow) => new Date(y.createdAt).getTime() - new Date(x.createdAt).getTime());
      setComments(all);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [guideSlugs]);

  const handleDelete = async (id: number) => {
    await fetch(`/api/guides/comments/${id}`, { method: "DELETE" });
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const filtered = slugFilter ? comments.filter(c => c.guideSlug === slugFilter) : comments;

  if (loading) return <div className="text-white/20 text-sm py-6 text-center">Loading comments...</div>;

  return (
    <div className="mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <MessageCircle size={15} className="text-white/25" />
          <h3 className="text-sm font-bold text-white">Community Comments</h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white/25" style={{ background: "rgba(255,255,255,0.04)" }}>{comments.length}</span>
        </div>
        <select
          value={slugFilter}
          onChange={(e) => setSlugFilter(e.target.value)}
          className="text-xs text-white/40 rounded-lg px-3 py-2 outline-none cursor-pointer"
          style={inputStyle}
        >
          <option value="">All guides</option>
          {guideSlugs.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs text-white/15 text-center py-8">No comments yet.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="flex items-start gap-3 px-4 py-3.5 rounded-xl group"
              style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-white/50">{c.name}</span>
                  <span className="text-[9px] font-mono text-white/15 px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.03)" }}>{c.guideSlug}</span>
                  {c.chapter && <span className="text-[9px] font-mono text-white/20 px-1.5 py-0.5 rounded" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.12)" }}>{c.chapter}</span>}
                  <span className="text-[9px] text-white/10 ml-auto">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-white/35 leading-relaxed">{c.text}</p>
              </div>
              <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-white/10 hover:text-red-400/60 hover:bg-white/[0.03] opacity-0 group-hover:opacity-100 transition-all shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GuidesEditor() {
  const [guides, setGuides] = useState<GuideRow[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchGuides = useCallback(async () => {
    const res = await fetch("/api/guides");
    const data = await res.json();
    setGuides(data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchGuides(); }, [fetchGuides]);

  const handleChange = (id: number, field: string, value: unknown) => {
    setGuides((prev) => prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)));
  };

  const handleSave = async (id: number) => {
    const guide = guides.find((g) => g.id === id);
    if (!guide) return;
    await fetch(`/api/guides/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: guide.title, subtitle: guide.subtitle, slug: guide.slug,
        summary: guide.summary, chapters: guide.chapters, pages: guide.pages,
        date: guide.date, accent: guide.accent, pdfUrl: guide.pdfUrl,
        topics: guide.topics, toc: guide.toc, takeaways: guide.takeaways,
        visible: guide.visible,
      }),
    });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/guides/${id}`, { method: "DELETE" });
    setGuides((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAdd = async () => {
    const res = await fetch("/api/guides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Guide", sortOrder: guides.length }),
    });
    const row = await res.json();
    setGuides((prev) => [...prev, row]);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = guides.findIndex((g) => g.id === active.id);
    const newIndex = guides.findIndex((g) => g.id === over.id);
    const reordered = arrayMove(guides, oldIndex, newIndex);
    setGuides(reordered);
    await fetch("/api/guides/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((g) => g.id) }),
    });
  };

  if (loading) {
    return <div className="text-white/20 text-sm py-12 text-center">Loading guides...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Guides</h2>
          <p className="text-xs text-white/20 mt-1">Manage your workflow guides. Upload PDFs to <code className="text-white/30 px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.04)" }}>public/guides/</code> then configure here.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-white/50 hover:text-white/70 transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Plus size={14} /> Add Guide
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={guides.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          {guides.map((guide) => (
            <SortableGuide
              key={guide.id}
              guide={guide}
              onChange={handleChange}
              onDelete={handleDelete}
              onSave={handleSave}
            />
          ))}
        </SortableContext>
      </DndContext>

      {guides.length === 0 && (
        <div className="text-center py-16 text-white/15 text-sm" style={{ background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: "12px" }}>
          No guides yet. Click &quot;Add Guide&quot; to create one.
        </div>
      )}

      <CommentsManager guideSlugs={guides.map((g) => g.slug)} />
    </div>
  );
}
