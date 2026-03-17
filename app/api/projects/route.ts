import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(projects).orderBy(asc(projects.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const [row] = await db
    .insert(projects)
    .values({
      slug: body.slug || `project-${Date.now()}`,
      title: body.title || "New Project",
      subtitle: body.subtitle || "",
      description: body.description || "",
      url: body.url || "#",
      tags: body.tags || [],
      year: body.year || new Date().getFullYear().toString(),
      iframeable: body.iframeable ?? false,
      span: body.span ?? 1,
      accent: body.accent || "",
      number: body.number || "",
      thumbnail: body.thumbnail || null,
      sortOrder: body.sortOrder ?? 99,
      visible: body.visible ?? true,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
