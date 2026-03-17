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
import { GripVertical, Plus, Trash2, Eye, EyeOff, Save, Check } from "lucide-react";

interface ProjectRow {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  previewUrl: string | null;
  tags: string[];
  year: string;
  iframeable: boolean;
  span: number;
  accent: string;
  number: string;
  thumbnail: string | null;
  sortOrder: number;
  visible: boolean;
}

function SortableCard({
  project,
  onChange,
  onDelete,
  onSave,
}: {
  project: ProjectRow;
  onChange: (id: number, field: string, value: unknown) => void;
  onDelete: (id: number) => void;
  onSave: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const [saved, setSaved] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onSave(project.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      className="rounded-xl p-5 mb-3"
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-1 rounded text-white/15 hover:text-white/30 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical size={16} />
        </button>

        <div className="flex-1 space-y-3">
          {/* Row 1: Title + slug + year */}
          <div className="grid grid-cols-3 gap-3">
            <input
              value={project.title}
              onChange={(e) => onChange(project.id, "title", e.target.value)}
              placeholder="Title"
              className="col-span-1 rounded-lg px-3 py-2 text-sm text-white outline-none transition-colors focus:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
            <input
              value={project.slug}
              onChange={(e) => onChange(project.id, "slug", e.target.value)}
              placeholder="slug"
              className="col-span-1 rounded-lg px-3 py-2 text-xs font-mono text-white/50 outline-none transition-colors focus:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
            <input
              value={project.year}
              onChange={(e) => onChange(project.id, "year", e.target.value)}
              placeholder="Year"
              className="col-span-1 rounded-lg px-3 py-2 text-sm text-white/50 outline-none transition-colors focus:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>

          {/* Row 2: Subtitle + URL */}
          <div className="grid grid-cols-2 gap-3">
            <input
              value={project.subtitle}
              onChange={(e) => onChange(project.id, "subtitle", e.target.value)}
              placeholder="Subtitle"
              className="rounded-lg px-3 py-2 text-sm text-white/60 outline-none transition-colors focus:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
            <input
              value={project.url}
              onChange={(e) => onChange(project.id, "url", e.target.value)}
              placeholder="URL"
              className="rounded-lg px-3 py-2 text-xs font-mono text-white/40 outline-none transition-colors focus:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>

          {/* Row 3: Preview URL + Thumbnail */}
          <div className="grid grid-cols-2 gap-3">
            <input
              value={project.previewUrl || ""}
              onChange={(e) => onChange(project.id, "previewUrl", e.target.value || null)}
              placeholder="Iframe preview URL (optional)"
              className="rounded-lg px-3 py-2 text-xs font-mono text-white/40 outline-none transition-colors focus:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
            <input
              value={project.thumbnail || ""}
              onChange={(e) => onChange(project.id, "thumbnail", e.target.value || null)}
              placeholder="Thumbnail URL (/thumbnails/...)"
              className="rounded-lg px-3 py-2 text-xs font-mono text-white/40 outline-none transition-colors focus:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>

          {/* Row 4: Description */}
          <textarea
            value={project.description}
            onChange={(e) => onChange(project.id, "description", e.target.value)}
            placeholder="Description"
            rows={2}
            className="w-full rounded-lg px-3 py-2 text-sm text-white/50 outline-none transition-colors focus:border-white/15 resize-none"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          />

          {/* Row 5: Tags + Iframeable */}
          <div className="flex gap-3 items-center">
            <input
              value={project.tags.join(", ")}
              onChange={(e) =>
                onChange(project.id, "tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))
              }
              placeholder="Tags (comma-separated)"
              className="flex-1 rounded-lg px-3 py-2 text-xs font-mono text-white/30 outline-none transition-colors focus:border-white/15"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
            <button
              onClick={() => onChange(project.id, "iframeable", !project.iframeable)}
              className="shrink-0 px-3 py-2 rounded-lg text-[10px] font-mono tracking-wider transition-colors"
              style={{
                background: project.iframeable ? "rgba(74,222,128,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${project.iframeable ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)"}`,
                color: project.iframeable ? "rgba(74,222,128,0.6)" : "rgba(255,255,255,0.2)",
              }}
            >
              {project.iframeable ? "IFRAME ON" : "IFRAME OFF"}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 ml-2">
          <button
            onClick={() => onChange(project.id, "visible", !project.visible)}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: "rgba(255,255,255,0.03)" }}
            title={project.visible ? "Visible" : "Hidden"}
          >
            {project.visible ? (
              <Eye size={14} className="text-white/30" />
            ) : (
              <EyeOff size={14} className="text-white/15" />
            )}
          </button>
          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: saved ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)" }}
            title="Save"
          >
            {saved ? (
              <Check size={14} className="text-green-400/60" />
            ) : (
              <Save size={14} className="text-white/30" />
            )}
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
            style={{ background: "rgba(255,255,255,0.03)" }}
            title="Delete"
          >
            <Trash2 size={14} className="text-white/15 hover:text-red-400/50" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProjectsEditor() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchProjects = useCallback(async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleChange = (id: number, field: string, value: unknown) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async (id: number) => {
    const project = projects.find((p) => p.id === id);
    if (!project) return;

    await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        url: project.url,
        previewUrl: project.previewUrl,
        tags: project.tags,
        year: project.year,
        iframeable: project.iframeable,
        span: project.span,
        thumbnail: project.thumbnail,
        visible: project.visible,
      }),
    });
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAdd = async () => {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Project",
        sortOrder: projects.length,
      }),
    });
    const newProject = await res.json();
    setProjects((prev) => [...prev, newProject]);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);
    setProjects(reordered);

    await fetch("/api/projects/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((p) => p.id) }),
    });
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-mono tracking-wider uppercase text-white/40">
          Projects ({projects.length})
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider text-white/40 hover:text-white/60 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Plus size={12} /> Add Project
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <SortableCard
              key={project.id}
              project={project}
              onChange={handleChange}
              onDelete={handleDelete}
              onSave={handleSave}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
