import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guideComments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const comments = await db
    .select()
    .from(guideComments)
    .where(eq(guideComments.guideSlug, slug))
    .orderBy(desc(guideComments.createdAt));

  return NextResponse.json({ comments });
}

export async function POST(req: NextRequest) {
  const { guideSlug, chapter, name, text, visitorId } = await req.json();

  if (!guideSlug || !name || !text || !visitorId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (text.length > 500) {
    return NextResponse.json({ error: "Comment too long" }, { status: 400 });
  }

  const [comment] = await db.insert(guideComments).values({
    guideSlug,
    chapter: chapter || null,
    name,
    text,
    visitorId,
  }).returning();

  return NextResponse.json(comment);
}
