import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { summonSpiritDialogue, Message } from "@/lib/ai-engine";
import { ShrineDocument } from "../shrines/route";

export async function POST(req: Request) {
  try {
    const { shrineSlug, userQuestion, history } = await req.json();

    if (!shrineSlug || !userQuestion) {
      return NextResponse.json(
        { error: "Missing required fields: shrineSlug and userQuestion are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("legacyseance");
    const shrine = await db.collection<ShrineDocument>("shrines").findOne({ slug: shrineSlug });

    if (!shrine) {
      return NextResponse.json(
        { error: `Shrine spirit for '${shrineSlug}' not found in the ofrenda` },
        { status: 404 }
      );
    }

    const reply = await summonSpiritDialogue(
      shrine.systemPrompt,
      history as Message[],
      userQuestion
    );

    return NextResponse.json({
      success: true,
      shrine: {
        name: shrine.name,
        slug: shrine.slug
      },
      reply
    });
  } catch (error) {
    console.error("Séance summoning error:", error);
    return NextResponse.json(
      { error: "Failed to contact spirit in the séance chamber" },
      { status: 500 }
    );
  }
}
