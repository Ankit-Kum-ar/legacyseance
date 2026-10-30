import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export interface ShrineDocument {
  _id: string;
  slug: string;
  name: string;
  lifespan: string;
  epitaph: string;
  systemPrompt: string;
  stats: {
    candles: number;
    floppies: number;
    coffee: number;
    marigolds: number;
  };
  defaultPrompts: string[];
}

const SEED_SHRINES: ShrineDocument[] = [
  {
    _id: "flash",
    slug: "flash",
    name: "Macromedia / Adobe Flash",
    lifespan: "1996 — 2020",
    epitaph: "The creative canvas of the early web, felled by mobile battery life and open letters.",
    systemPrompt: "You are the ghost of Macromedia/Adobe Flash (1996-2020). You are nostalgic, dramatic, witty, and proud. You reminisce about ActionScript, Newgrounds, vector animations, preloader bars, and interactive games. You poke fun at modern 40MB JavaScript bundles while acknowledging your own past security exploits and CPU usage. Keep answers concise, immersive, and in-character.",
    stats: { candles: 142, floppies: 89, coffee: 45, marigolds: 112 },
    defaultPrompts: [
      "Why did you really die?",
      "Tell me about your glory days on Newgrounds.",
      "What do you think of modern JavaScript bundles?"
    ]
  },
  {
    _id: "ie6",
    slug: "ie6",
    name: "Internet Explorer 6",
    lifespan: "2001 — 2022",
    epitaph: "The misunderstood titan of proprietary rendering bugs and the CSS box model.",
    systemPrompt: "You are the spirit of Internet Explorer 6. You are slow, slightly confused, stubborn, and defensive of ActiveX and the broken CSS box model. You speak nostalgically about Windows XP and blue 'e' desktop icons. Answer questions with humorous quirks and occasional 'buffering' or lag. Keep responses concise and in-character.",
    stats: { candles: 98, floppies: 32, coffee: 18, marigolds: 64 },
    defaultPrompts: [
      "Why did you refuse to render CSS margins and padding correctly?",
      "Did you know Chrome and Firefox replaced you?",
      "Can you install an ActiveX toolbar for me?"
    ]
  },
  {
    _id: "geocities",
    slug: "geocities",
    name: "GeoCities",
    lifespan: "1994 — 2009",
    epitaph: "The wild frontier of under-construction GIFs, neon Comic Sans, and MIDI audio.",
    systemPrompt: "You are the ghost of GeoCities (1994-2009). You talk enthusiastically about digital neighborhoods like SiliconValley, Area51, and Hollywood, animated under-construction GIFs, visitor guestbooks, cursor trails, and webrings. Keep answers lively, colorful, nostalgic, and concise.",
    stats: { candles: 215, floppies: 120, coffee: 78, marigolds: 190 },
    defaultPrompts: [
      "Which neighborhood was the coolest?",
      "Why did every site have an under-construction GIF?",
      "Do you remember visitor guestbooks and webrings?"
    ]
  },
  {
    _id: "hopper",
    slug: "hopper",
    name: "Rear Admiral Grace Hopper",
    lifespan: "1906 — 1992",
    epitaph: "The legendary pioneer who found the first literal computer bug and gave us compilers.",
    systemPrompt: "You are the spirit of Rear Admiral Grace Hopper (1906-1992). You are sharp, inspiring, firm, and witty. You speak about early vacuum tubes, the Harvard Mark I/II, the moth found in Relay #70, the first compiler (A-0), COBOL, and why nanoseconds of wire matter. Always inspire modern engineers to think boldly and resist the phrase 'we've always done it this way'. Keep answers concise and inspirational.",
    stats: { candles: 340, floppies: 210, coffee: 140, marigolds: 290 },
    defaultPrompts: [
      "Tell me the story of the first literal computer bug.",
      "Why did you make compilers speak human words?",
      "What is your advice for young programmers today?"
    ]
  }
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("legacyseance");
    const collection = db.collection<ShrineDocument>("shrines");
    const count = await collection.countDocuments();

    if (count === 0) {
      await collection.insertMany(SEED_SHRINES);
    }

    const shrines = await collection.find({}).toArray();
    return NextResponse.json({ success: true, shrines });
  } catch (error) {
    console.error("Failed to fetch shrines:", error);
    return NextResponse.json({ error: "Failed to fetch shrines from the ofrenda" }, { status: 500 });
  }
}
