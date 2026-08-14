import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guides } from "@/lib/db/schema";
import { getAllGuides } from "@/lib/db/queries";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const rows = await getAllGuides();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const [row] = await db.insert(guides).values({
    slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    title: body.title,
    subtitle: body.subtitle || "",
    summary: body.summary || "",
    chapters: body.chapters || 0,
    pages: body.pages || 0,
    date: body.date || "",
    accent: body.accent || "#6366f1",
    pdfUrl: body.pdfUrl || "",
    topics: body.topics || [],
    sortOrder: body.sortOrder || 0,
    visible: body.visible ?? true,
  }).returning();

  return NextResponse.json(row);
}
