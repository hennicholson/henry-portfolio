import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { guides } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ids } = await req.json() as { ids: number[] };

  await Promise.all(
    ids.map((id, index) =>
      db.update(guides).set({ sortOrder: index }).where(eq(guides.id, id))
    )
  );

  return NextResponse.json({ ok: true });
}
