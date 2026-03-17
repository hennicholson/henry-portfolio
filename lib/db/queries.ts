import { db } from "./index";
import { projects, leads } from "./schema";
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
