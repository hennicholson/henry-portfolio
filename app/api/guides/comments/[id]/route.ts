import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guideComments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await db.delete(guideComments).where(eq(guideComments.id, parseInt(id)));
  return NextResponse.json({ ok: true });
}
