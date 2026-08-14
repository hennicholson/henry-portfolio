import { db } from "./index";
import { projects, leads, toolCategories, tools, testimonials, testimonialReactions, guides } from "./schema";
import { eq, asc, desc, and, sql } from "drizzle-orm";
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

export interface ReactionCount {
  testimonialId: number;
  emoji: string;
  count: number;
}

export async function getReactionCounts(testimonialIds: number[]): Promise<ReactionCount[]> {
  if (testimonialIds.length === 0) return [];
  try {
    const rows = await db
      .select({
        testimonialId: testimonialReactions.testimonialId,
        emoji: testimonialReactions.emoji,
        count: sql<number>`count(*)::int`,
      })
      .from(testimonialReactions)
      .where(sql`${testimonialReactions.testimonialId} = ANY(${testimonialIds})`)
      .groupBy(testimonialReactions.testimonialId, testimonialReactions.emoji);
    return rows;
  } catch (error) {
    console.error("Failed to fetch reaction counts:", error);
    return [];
  }
}

export async function toggleReaction(testimonialId: number, emoji: string, visitorId: string): Promise<"added" | "removed"> {
  const existing = await db
    .select()
    .from(testimonialReactions)
    .where(
      and(
        eq(testimonialReactions.testimonialId, testimonialId),
        eq(testimonialReactions.emoji, emoji),
        eq(testimonialReactions.visitorId, visitorId),
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db.delete(testimonialReactions).where(eq(testimonialReactions.id, existing[0].id));
    return "removed";
  } else {
    await db.insert(testimonialReactions).values({ testimonialId, emoji, visitorId });
    return "added";
  }
}

// ─── Guides ───

export async function getVisibleGuides() {
  try {
    return await db
      .select()
      .from(guides)
      .where(eq(guides.visible, true))
      .orderBy(asc(guides.sortOrder));
  } catch (error) {
    console.error("Failed to fetch guides:", error);
    return [];
  }
}

export async function getAllGuides() {
  return db.select().from(guides).orderBy(asc(guides.sortOrder));
}
