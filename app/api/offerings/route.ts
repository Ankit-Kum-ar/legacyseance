import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ShrineDocument } from "../shrines/route";

const OFFERING_ICONS: Record<string, string> = {
  candle: "🕯️",
  floppy: "💾",
  coffee: "☕",
  marigold: "🌼"
};

export interface OfferingDocument {
  shrineSlug: string;
  shrineName: string;
  author: string;
  type: "candle" | "floppy" | "coffee" | "marigold";
  icon: string;
  eulogy: string;
  createdAt: Date;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("legacyseance");
    const offerings = await db
      .collection<OfferingDocument>("offerings")
      .find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .toArray();

    return NextResponse.json({ success: true, offerings });
  } catch (error) {
    console.error("Failed to fetch offerings:", error);
    return NextResponse.json({ error: "Failed to fetch memorial offerings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { shrineSlug, author, type, eulogy } = await req.json();

    if (!shrineSlug || !eulogy || !type) {
      return NextResponse.json(
        { error: "Missing required tribute details (shrineSlug, type, eulogy)" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("legacyseance");

    const shrine = await db.collection<ShrineDocument>("shrines").findOne({ slug: shrineSlug });
    if (!shrine) {
      return NextResponse.json({ error: "Shrine not found" }, { status: 404 });
    }

    const newOffering: OfferingDocument = {
      shrineSlug,
      shrineName: shrine.name,
      author: (author && String(author).trim()) || "Anonymous Hacker",
      type,
      icon: OFFERING_ICONS[type] || "🕯️",
      eulogy: String(eulogy).trim(),
      createdAt: new Date()
    };

    const insertResult = await db.collection("offerings").insertOne(newOffering);

    // Map offering type to the corresponding stats counter (candles, floppies, coffee, marigolds)
    const statKey = type === "coffee" ? "stats.coffee" : `stats.${type}s`;

    await db.collection("shrines").updateOne(
      { slug: shrineSlug },
      { $inc: { [statKey]: 1 } }
    );

    return NextResponse.json({
      success: true,
      offeringId: insertResult.insertedId,
      offering: newOffering
    });
  } catch (error) {
    console.error("Failed to record offering:", error);
    return NextResponse.json({ error: "Failed to record memorial tribute" }, { status: 500 });
  }
}
