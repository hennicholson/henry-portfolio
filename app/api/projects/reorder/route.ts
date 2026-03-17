import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderedIds } = await request.json();

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
  }

  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(projects)
      .set({ sortOrder: i, updatedAt: sql`now()` })
      .where(eq(projects.id, orderedIds[i]));
  }

  return NextResponse.json({ ok: true });
}
