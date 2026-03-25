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
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Check,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface ToolRow {
  id: number;
  categoryId: number;
  name: string;
  note: string;
  logoUrl: string | null;
  sortOrder: number;
  visible: boolean;
}

interface CategoryRow {
  id: number;
  label: string;
  sortOrder: number;
  visible: boolean;
}

function SortableTool({
  tool,
  onChange,
  onDelete,
  onSave,
}: {
  tool: ToolRow;
  onChange: (id: number, field: string, value: unknown) => void;
  onDelete: (id: number) => void;
  onSave: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: tool.id });
  const [saved, setSaved] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onSave(tool.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "rgba(255,255,255,0.015)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
      className="rounded-lg p-3 mb-2"
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded text-white/15 hover:text-white/30 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical size={14} />
        </button>

        <input
          value={tool.name}
          onChange={(e) => onChange(tool.id, "name", e.target.value)}
          placeholder="Name"
          className="flex-1 rounded-lg px-2.5 py-1.5 text-sm text-white outline-none transition-colors focus:border-white/15"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        />
        <input
          value={tool.note}
          onChange={(e) => onChange(tool.id, "note", e.target.value)}
          placeholder="Note"
          className="w-24 rounded-lg px-2.5 py-1.5 text-xs font-mono text-white/40 outline-none transition-colors focus:border-white/15"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        />
        <input
          value={tool.logoUrl || ""}
          onChange={(e) => onChange(tool.id, "logoUrl", e.target.value || null)}
          placeholder="/logos/tool.svg"
          className="w-36 rounded-lg px-2.5 py-1.5 text-[10px] font-mono text-white/30 outline-none transition-colors focus:border-white/15"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        />

        <button
          onClick={() => onChange(tool.id, "visible", !tool.visible)}
          className="p-1 rounded-lg transition-colors"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {tool.visible ? (
            <Eye size={12} className="text-white/30" />
          ) : (
            <EyeOff size={12} className="text-white/15" />
          )}
        </button>
        <button
          onClick={handleSave}
          className="p-1 rounded-lg transition-colors"
          style={{ background: saved ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)" }}
        >
          {saved ? (
            <Check size={12} className="text-green-400/60" />
          ) : (
            <Save size={12} className="text-white/30" />
          )}
        </button>
        <button
          onClick={() => onDelete(tool.id)}
          className="p-1 rounded-lg transition-colors hover:bg-red-500/10"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <Trash2 size={12} className="text-white/15 hover:text-red-400/50" />
        </button>
      </div>
    </div>
  );
}

function SortableCategory({
  category,
  toolItems,
  onCategoryChange,
  onCategoryDelete,
  onCategorySave,
  onToolChange,
  onToolDelete,
  onToolSave,
  onToolAdd,
  onToolReorder,
}: {
  category: CategoryRow;
  toolItems: ToolRow[];
  onCategoryChange: (id: number, field: string, value: unknown) => void;
  onCategoryDelete: (id: number) => void;
  onCategorySave: (id: number) => void;
  onToolChange: (id: number, field: string, value: unknown) => void;
  onToolDelete: (id: number) => void;
  onToolSave: (id: number) => void;
  onToolAdd: (categoryId: number) => void;
  onToolReorder: (categoryId: number, orderedIds: number[]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: category.id });
  const [expanded, setExpanded] = useState(true);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onCategorySave(category.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleToolDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = toolItems.findIndex((t) => t.id === active.id);
    const newIndex = toolItems.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(toolItems, oldIndex, newIndex);
    onToolReorder(
      category.id,
      reordered.map((t) => t.id)
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      className="rounded-xl p-4 mb-3"
    >
      {/* Category header */}
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="p-1 rounded text-white/15 hover:text-white/30 cursor-grab active:cursor-grabbing transition-colors"
        >
          <GripVertical size={16} />
        </button>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-0.5 text-white/20 hover:text-white/40 transition-colors"
        >
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <input
          value={category.label}
          onChange={(e) => onCategoryChange(category.id, "label", e.target.value)}
          className="flex-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white outline-none transition-colors focus:border-white/15"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        />

        <span className="text-[10px] font-mono text-white/20 tabular-nums">
          {toolItems.length} tools
        </span>

        <button
          onClick={() => onCategoryChange(category.id, "visible", !category.visible)}
          className="p-1.5 rounded-lg transition-colors"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          {category.visible ? (
            <Eye size={14} className="text-white/30" />
          ) : (
            <EyeOff size={14} className="text-white/15" />
          )}
        </button>
        <button
          onClick={handleSave}
          className="p-1.5 rounded-lg transition-colors"
          style={{ background: saved ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)" }}
        >
          {saved ? (
            <Check size={14} className="text-green-400/60" />
          ) : (
            <Save size={14} className="text-white/30" />
          )}
        </button>
        <button
          onClick={() => onCategoryDelete(category.id)}
          className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <Trash2 size={14} className="text-white/15 hover:text-red-400/50" />
        </button>
      </div>

      {/* Tools list */}
      {expanded && (
        <div className="mt-3 ml-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleToolDragEnd}
          >
            <SortableContext
              items={toolItems.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {toolItems.map((tool) => (
                <SortableTool
                  key={tool.id}
                  tool={tool}
                  onChange={onToolChange}
                  onDelete={onToolDelete}
                  onSave={onToolSave}
                />
              ))}
            </SortableContext>
          </DndContext>

          <button
            onClick={() => onToolAdd(category.id)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono tracking-wider text-white/25 hover:text-white/40 transition-colors mt-1"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <Plus size={10} /> Add Tool
          </button>
        </div>
      )}
    </div>
  );
}

export function ToolsEditor() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [toolItems, setToolItems] = useState<ToolRow[]>([]);
  const [loading, setLoading] = useState(true);

  const catSensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchData = useCallback(async () => {
    const [catsRes, toolsRes] = await Promise.all([
      fetch("/api/tool-categories"),
      fetch("/api/tools"),
    ]);
    setCategories(await catsRes.json());
    setToolItems(await toolsRes.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Category handlers
  const handleCategoryChange = (id: number, field: string, value: unknown) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const handleCategorySave = async (id: number) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    await fetch(`/api/tool-categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: cat.label, visible: cat.visible }),
    });
  };

  const handleCategoryDelete = async (id: number) => {
    await fetch(`/api/tool-categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setToolItems((prev) => prev.filter((t) => t.categoryId !== id));
  };

  const handleCategoryAdd = async () => {
    const res = await fetch("/api/tool-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "New Category", sortOrder: categories.length }),
    });
    const newCat = await res.json();
    setCategories((prev) => [...prev, newCat]);
  };

  const handleCategoryDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);
    await fetch("/api/tool-categories/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((c) => c.id) }),
    });
  };

  // Tool handlers
  const handleToolChange = (id: number, field: string, value: unknown) => {
    setToolItems((prev) => prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleToolSave = async (id: number) => {
    const tool = toolItems.find((t) => t.id === id);
    if (!tool) return;
    await fetch(`/api/tools/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tool.name,
        note: tool.note,
        logoUrl: tool.logoUrl,
        visible: tool.visible,
      }),
    });
  };

  const handleToolDelete = async (id: number) => {
    await fetch(`/api/tools/${id}`, { method: "DELETE" });
    setToolItems((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToolAdd = async (categoryId: number) => {
    const catTools = toolItems.filter((t) => t.categoryId === categoryId);
    const res = await fetch("/api/tools", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name: "New Tool", sortOrder: catTools.length }),
    });
    const newTool = await res.json();
    setToolItems((prev) => [...prev, newTool]);
  };

  const handleToolReorder = async (categoryId: number, orderedIds: number[]) => {
    setToolItems((prev) => {
      const otherTools = prev.filter((t) => t.categoryId !== categoryId);
      const reordered = orderedIds.map((id, i) => {
        const tool = prev.find((t) => t.id === id)!;
        return { ...tool, sortOrder: i };
      });
      return [...otherTools, ...reordered].sort((a, b) => a.sortOrder - b.sortOrder);
    });
    await fetch("/api/tools/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds }),
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
          Tool Categories ({categories.length})
        </h2>
        <button
          onClick={handleCategoryAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider text-white/40 hover:text-white/60 transition-colors"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Plus size={12} /> Add Category
        </button>
      </div>

      <DndContext
        sensors={catSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleCategoryDragEnd}
      >
        <SortableContext
          items={categories.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {categories.map((cat) => (
            <SortableCategory
              key={cat.id}
              category={cat}
              toolItems={toolItems
                .filter((t) => t.categoryId === cat.id)
                .sort((a, b) => a.sortOrder - b.sortOrder)}
              onCategoryChange={handleCategoryChange}
              onCategoryDelete={handleCategoryDelete}
              onCategorySave={handleCategorySave}
              onToolChange={handleToolChange}
              onToolDelete={handleToolDelete}
              onToolSave={handleToolSave}
              onToolAdd={handleToolAdd}
              onToolReorder={handleToolReorder}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
