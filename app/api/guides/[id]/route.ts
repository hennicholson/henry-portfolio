import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guides } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const [row] = await db
    .update(guides)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(guides.id, parseInt(id)))
    .returning();

  return NextResponse.json(row);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.delete(guides).where(eq(guides.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}
