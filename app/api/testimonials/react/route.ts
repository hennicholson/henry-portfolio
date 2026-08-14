import { NextRequest, NextResponse } from "next/server";
import { toggleReaction, getReactionCounts } from "@/lib/db/queries";

const ALLOWED_EMOJIS = ["🔥", "💯", "🙌", "❤️", "👏", "✨"];

export async function POST(req: NextRequest) {
  try {
    const { testimonialId, emoji, visitorId } = await req.json();

    if (!testimonialId || !emoji || !visitorId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (!ALLOWED_EMOJIS.includes(emoji)) {
      return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
    }

    const result = await toggleReaction(testimonialId, emoji, visitorId);
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const ids = req.nextUrl.searchParams.get("ids");
    if (!ids) {
      return NextResponse.json({ error: "Missing ids" }, { status: 400 });
    }

    const testimonialIds = ids.split(",").map(Number).filter(Boolean);
    const counts = await getReactionCounts(testimonialIds);
    return NextResponse.json({ counts });
  } catch (error) {
    console.error("Reaction fetch error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
