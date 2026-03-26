import { db } from "./index";
import { projects, leads, toolCategories, tools, testimonials } from "./schema";
import { eq, asc, desc } from "drizzle-orm";
import type { ProjectData } from "@/components/project-gallery";
export type { ProjectData };

export async function getVisibleProjects(): Promise<ProjectData[]> {
  try {
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.visible, true))
      .orderBy(asc(projects.sortOrder));

    return rows.map((row) => ({
      id: row.slug,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      url: row.url,
      previewUrl: row.previewUrl ?? undefined,
      tags: row.tags,
      year: row.year,
      iframeable: row.iframeable,
      ...(row.span === 2 ? { span: 2 as const } : {}),
      accent: row.accent,
      number: row.number,
      thumbnail: row.thumbnail ?? undefined,
    }));
  } catch (error) {
    console.error("Failed to fetch projects from DB:", error);
    return [];
  }
}

export async function getAllProjects() {
  return db.select().from(projects).orderBy(asc(projects.sortOrder));
}

export async function getAllLeads() {
  return db.select().from(leads).orderBy(desc(leads.createdAt));
}

export interface ToolCategoryWithTools {
  id: number;
  label: string;
  tools: { id: number; name: string; note: string; logoUrl: string | null }[];
}

export async function getVisibleToolCategories(): Promise<ToolCategoryWithTools[]> {
  try {
    const cats = await db
      .select()
      .from(toolCategories)
      .where(eq(toolCategories.visible, true))
      .orderBy(asc(toolCategories.sortOrder));

    const allTools = await db
      .select()
      .from(tools)
      .where(eq(tools.visible, true))
      .orderBy(asc(tools.sortOrder));

    return cats.map((cat) => ({
      id: cat.id,
      label: cat.label,
      tools: allTools
        .filter((t) => t.categoryId === cat.id)
        .map((t) => ({ id: t.id, name: t.name, note: t.note, logoUrl: t.logoUrl })),
    }));
  } catch (error) {
    console.error("Failed to fetch tool categories:", error);
    return [];
  }
}

export async function getVisibleTestimonials() {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.visible, true))
      .orderBy(desc(testimonials.createdAt));
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export async function getAllTestimonials() {
  return db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
}
