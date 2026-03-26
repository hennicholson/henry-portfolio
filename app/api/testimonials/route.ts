import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

const avatarColors = [
  "rgba(59,130,246,0.25)",
  "rgba(168,85,247,0.25)",
  "rgba(34,197,94,0.25)",
  "rgba(251,191,36,0.25)",
  "rgba(239,68,68,0.25)",
  "rgba(14,165,233,0.25)",
  "rgba(244,114,182,0.25)",
];

// GET — visible testimonials (public), or all (admin with ?all=true)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";

  if (showAll) {
    const { isAuthenticated } = await import("@/lib/auth");
    if (!(await isAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const rows = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
    return NextResponse.json(rows);
  }

  const rows = await db
    .select()
    .from(testimonials)
    .where(eq(testimonials.visible, true))
    .orderBy(desc(testimonials.createdAt));
  return NextResponse.json(rows);
}

// Public POST — anyone can submit (visible defaults to false for moderation)
export async function POST(request: Request) {
  const body = await request.json();

  if (!body.name || !body.text) {
    return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
  }

  const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  const [row] = await db
    .insert(testimonials)
    .values({
      name: body.name,
      text: body.text,
      avatarUrl: body.avatarUrl || null,
      workplace: body.workplace || null,
      color,
      visible: false,
    })
    .returning();

  revalidatePath("/");
  return NextResponse.json(row, { status: 201 });
}
