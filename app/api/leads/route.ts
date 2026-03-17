import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { isAuthenticated } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { createHmac, timingSafeEqual } from "crypto";

function verifyWebhookSignature(body: string, signature: string): boolean {
  const secret = process.env.ELEVENLABS_WEBHOOK_SECRET;
  if (!secret) return false;

  // ElevenLabs-Signature header format: t=<timestamp>,v0=<hash>
  const parts = signature.split(",");
  const timestamp = parts.find((p) => p.startsWith("t="))?.slice(2);
  const hash = parts.find((p) => p.startsWith("v0="))?.slice(3);

  if (!timestamp || !hash) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt));
  return NextResponse.json(rows);
}

// POST is called by ElevenLabs post-call webhook
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("elevenlabs-signature");

  // If request has ElevenLabs signature header, verify it
  // Requests without the header are from our own forms (newsletter, etc.)
  if (signature) {
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const body = JSON.parse(rawBody);

  // Handle ElevenLabs post_call_transcription webhook format
  if (body.type === "post_call_transcription" && body.data) {
    const collectedInfo = body.data.analysis?.collected_info || {};

    const [row] = await db
      .insert(leads)
      .values({
        name: collectedInfo.name || null,
        email: collectedInfo.email || null,
        source: "voice_agent",
        metadata: {
          conversation_id: body.data.conversation_id,
          agent_id: body.data.agent_id,
          status: body.data.status,
          collected_info: collectedInfo,
        },
      })
      .returning();

    return NextResponse.json(row, { status: 201 });
  }

  // Fallback: direct POST with { name, email }
  const [row] = await db
    .insert(leads)
    .values({
      name: body.name || null,
      email: body.email || null,
      source: body.source || "voice_agent",
      metadata: body.metadata || null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}
