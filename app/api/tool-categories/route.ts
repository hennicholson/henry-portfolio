import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { toolCategories } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { asc } from "drizzle-orm";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(toolCategories).orderBy(asc(toolCategories.sortOrder));
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const [row] = await db
    .insert(toolCategories)
    .values({
      label: body.label || "New Category",
      sortOrder: body.sortOrder ?? 99,
      visible: body.visible ?? true,
    })
    .returning();

  revalidatePath("/");
  return NextResponse.json(row, { status: 201 });
}
