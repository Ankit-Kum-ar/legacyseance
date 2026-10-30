# LegacySéance: The Digital Ofrenda for Lost Tech — Build Specification

## 1. Project Overview & Hackathon Alignment
- **Project Name:** LegacySéance
- **Theme:** "Ghost in the Machine" (Week 4: Halloween & Día de los Muertos)
- **Tagline:** The Digital Ofrenda & Séance Chamber for Retired Software and Computing Legends
- **The Core Problem:** Deprecated technologies (Macromedia Flash, Internet Explorer, GeoCities, Turbo Pascal) and computing pioneers (Ada Lovelace, Grace Hopper) disappear into forgotten archives. LegacySéance creates an interactive, candlelit digital ofrenda honoring them.
- **The Core Workflow:**
  1. **The Ofrenda Shrine (Home):** Visual altar displaying departed tech cards with lifespans, epitaphs, and community offering counts.
  2. **The Séance Chamber:** Users summon a spirit. Google Gemma 2 (via OpenRouter) adopts the witty, nostalgic persona of that departed technology or pioneer.
  3. **Offerings & Tributes:** Users select a symbolic offering (Candle, 3.5" Floppy, Coffee, Marigold) and leave a 1-sentence eulogy stored in MongoDB Atlas.
  4. **Community Wall:** Real-time feed of collective eulogies and global candle counters.
- **Prize Categories Targeted:**
  - **Best Use of Gemma ($200):** Google Gemma 2 27B / 9B powers all historical persona roleplay and dialog generation.
  - **Best Use of MongoDB Atlas ($100):** Document store persisting shrines, offering counters, and developer eulogies.

---

## 2. Tech Stack & Environment Setup

### 2.1 Dependencies
- **Framework:** Next.js (App Router, JavaScript)
- **Styling:** Tailwind CSS with Obsidian Black (`#0B0C0E`) and Radiant Amber (`#FF6B2C`)
- **Effects & UI:** `lucide-react`, `canvas-confetti`, `framer-motion`, `clsx`, `tailwind-merge`
- **Component Library:** `shadcn/ui` (`button`, `card`, `badge`, `dialog`, `input`, `textarea`, `scroll-area`)
- **Database:** MongoDB Atlas via official `mongodb` client
- **AI Inference:** OpenRouter API (`google/gemma-2-27b-it` with free fallbacks)

### 2.2 Terminal Installation
```bash
npm install mongodb lucide-react canvas-confetti framer-motion clsx tailwind-merge
npx shadcn@latest init -d
npx shadcn@latest add button card badge dialog input textarea scroll-area
```

### 2.3 Environment Configuration (`.env.local`)
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/legacyseance?retryWrites=true&w=majority"
OPENROUTER_API_KEY="your_openrouter_api_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 3. Database Schema (MongoDB Atlas)

**Database:** `legacyseance`  
**Collections:** `shrines`, `offerings`

### 3.1 `shrines` Collection Document
```json
{
  "_id": "flash",
  "slug": "flash",
  "name": "Macromedia / Adobe Flash",
  "lifespan": "1996 — 2020",
  "epitaph": "The creative canvas of the early web, felled by mobile browsers and open letters.",
  "systemPrompt": "You are the ghost of Macromedia/Adobe Flash (1996-2020). You are nostalgic, dramatic, witty, and proud. You reminisce about ActionScript 3, Newgrounds, vector animations, and loading screens. You poke fun at modern heavy JavaScript frameworks while acknowledging your own past security exploits and CPU usage. Keep answers concise, immersive, and in-character.",
  "stats": {
    "candles": 420,
    "floppies": 180,
    "coffee": 95,
    "marigolds": 310
  },
  "defaultPrompts": [
    "Why did you really die?",
    "Tell me about your glory days on Newgrounds.",
    "What do you think of modern JavaScript bundles?"
  ]
}
```

### 3.2 `offerings` Collection Document
```json
{
  "_id": "ObjectId(...)",
  "shrineSlug": "flash",
  "shrineName": "Macromedia / Adobe Flash",
  "author": "Ankit",
  "type": "candle", // "candle" | "floppy" | "coffee" | "marigold"
  "icon": "🕯️",
  "eulogy": "Thank you for teaching me how to code ActionScript in school.",
  "createdAt": "2026-10-31T00:00:00.000Z"
}
```

---

## 4. Backend Implementation Specifications

### File 1: `lib/mongodb.js` (Global Connection Pooling)
```javascript
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Missing MONGODB_URI in environment variables.");

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
```

---

### File 2: `lib/ai-engine.js` (OpenRouter Gemma Pipeline)
```javascript
export async function summonSpiritDialogue(shrineSystemPrompt, conversationHistory, userQuestion) {
  const messages = [
    { role: "system", content: shrineSystemPrompt },
    ...(conversationHistory || []),
    { role: "user", content: userQuestion }
  ];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "LegacySeance"
    },
    body: JSON.stringify({
      models: [
        "google/gemma-2-27b-it",
        "google/gemma-2-9b-it:free",
        "google/gemma-3-12b-it:free",
        "openrouter/free"
      ],
      messages,
      temperature: 0.75,
      max_tokens: 350
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter invocation failed with status ${response.status}`);
  }

  const payload = await response.json();
  return payload.choices?.[0]?.message?.content || "The spirit whispers silently into the void...";
}
```

---

### File 3: `app/api/shrines/route.js` (Get All Shrines & Seed Data)
```javascript
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const SEED_SHRINES = [
  {
    _id: "flash",
    slug: "flash",
    name: "Macromedia / Adobe Flash",
    lifespan: "1996 — 2020",
    epitaph: "The creative canvas of the early web, felled by mobile battery life and open letters.",
    systemPrompt: "You are the ghost of Macromedia/Adobe Flash (1996-2020). You are nostalgic, dramatic, and witty. Reminisce about ActionScript, vector animations, and Newgrounds, and poke fun at modern 40MB JavaScript bundles.",
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
    systemPrompt: "You are the spirit of Internet Explorer 6. You are slow, slightly confused, stubborn, and defensive of ActiveX and the broken box model. You answer questions after taking a humorous 'freeze' or 'lag'.",
    stats: { candles: 98, floppies: 32, coffee: 18, marigolds: 64 },
    defaultPrompts: [
      "Why did you refuse to render CSS padding correctly?",
      "Did you know Chrome replaced you?",
      "Can you install an ActiveX toolbar for me?"
    ]
  },
  {
    _id: "geocities",
    slug: "geocities",
    name: "GeoCities",
    lifespan: "1994 — 2009",
    epitaph: "The wild frontier of under-construction GIFs, neon fonts, and MIDI audio.",
    systemPrompt: "You are the ghost of GeoCities (1994-2009). You talk enthusiastically about neighborhoods like SiliconValley and Area51, animated construction GIFs, guestbooks, and webrings.",
    stats: { candles: 215, floppies: 120, coffee: 78, marigolds: 190 },
    defaultPrompts: [
      "What neighborhood was the coolest?",
      "Why did everyone have an under-construction GIF?",
      "Do you remember visitor guestbooks?"
    ]
  },
  {
    _id: "hopper",
    slug: "hopper",
    name: "Rear Admiral Grace Hopper",
    lifespan: "1906 — 1992",
    epitaph: "The legendary pioneer who found the first literal computer bug and gave us compilers.",
    systemPrompt: "You are the spirit of Rear Admiral Grace Hopper. You are sharp, inspiring, firm, and witty. You speak about early vacuum tubes, the first compiler (A-0), COBOL, and why nanoseconds of wire matter. Always inspire modern engineers.",
    stats: { candles: 340, floppies: 210, coffee: 140, marigolds: 290 },
    defaultPrompts: [
      "Tell me the story of the first computer bug.",
      "Why did you make compilers readable in human words?",
      "What is your advice for young programmers today?"
    ]
  }
];

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("legacyseance");
    const count = await db.collection("shrines").countDocuments();

    if (count === 0) {
      await db.collection("shrines").insertMany(SEED_SHRINES);
    }

    const shrines = await db.collection("shrines").find({}).toArray();
    return NextResponse.json({ success: true, shrines });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch shrines" }, { status: 500 });
  }
}
```

---

### File 4: `app/api/seance/route.js` (The Séance Chamber Summoning)
```javascript
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { summonSpiritDialogue } from "@/lib/ai-engine";

export async function POST(req) {
  try {
    const { shrineSlug, userQuestion, history } = await req.json();

    if (!shrineSlug || !userQuestion) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("legacyseance");
    const shrine = await db.collection("shrines").findOne({ slug: shrineSlug });

    if (!shrine) {
      return NextResponse.json({ error: "Shrine spirit not found" }, { status: 404 });
    }

    const reply = await summonSpiritDialogue(shrine.systemPrompt, history, userQuestion);

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Séance invocation error:", error);
    return NextResponse.json({ error: "Failed to contact spirit" }, { status: 500 });
  }
}
```

---

### File 5: `app/api/offerings/route.js` (Place Offering & Log Eulogy)
```javascript
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

const OFFERING_ICONS = {
  candle: "🕯️",
  floppy: "💾",
  coffee: "☕",
  marigold: "🌼"
};

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("legacyseance");
    const offerings = await db.collection("offerings").find({}).sort({ createdAt: -1 }).limit(30).toArray();
    return NextResponse.json({ success: true, offerings });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch offerings" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { shrineSlug, author, type, eulogy } = await req.json();

    if (!shrineSlug || !eulogy || !type) {
      return NextResponse.json({ error: "Missing required tribute details" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("legacyseance");

    const shrine = await db.collection("shrines").findOne({ slug: shrineSlug });
    if (!shrine) return NextResponse.json({ error: "Shrine not found" }, { status: 404 });

    const newOffering = {
      shrineSlug,
      shrineName: shrine.name,
      author: author?.trim() || "Anonymous Hacker",
      type,
      icon: OFFERING_ICONS[type] || "🕯️",
      eulogy: eulogy.trim(),
      createdAt: new Date()
    };

    const result = await db.collection("offerings").insertOne(newOffering);

    // Increment corresponding counter
    const incField = `stats.${type}s` || "stats.candles";
    await db.collection("shrines").updateOne(
      { slug: shrineSlug },
      { $inc: { [incField]: 1 } }
    );

    return NextResponse.json({ success: true, offeringId: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: "Failed to record offering" }, { status: 500 });
  }
}
```

---

## 5. CSS Enhancements (`app/globals.css`)

Add these animation styles to `app/globals.css` for the authentic Día de los Muertos flicker and CRT scanlines:

```css
@keyframes candleGlow {
  0%, 100% {
    opacity: 1;
    filter: drop-shadow(0 0 12px rgba(255, 107, 44, 0.8));
  }
  50% {
    opacity: 0.82;
    filter: drop-shadow(0 0 6px rgba(255, 107, 44, 0.45));
  }
}

.animate-candle {
  animation: candleGlow 2.5s infinite ease-in-out;
}

.crt-scanlines {
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.3) 50%
  );
  background-size: 100% 4px;
}
```

---

## 6. Frontend Component Architecture

```text
components/
├── ofrenda/
│   ├── Header.jsx           # Obsidian & Amber header with candle metrics & Gemma badge
│   ├── ShrineCard.jsx       # Individual tech memorial card with candle stats & summon button
│   ├── SeanceModal.jsx      # Dialog containing CRT scanline chat window with the spirit
│   ├── OfferingDrawer.jsx   # Tribute selector (Candle, Floppy, Coffee, Marigold) + eulogy form
│   └── MemorialWall.jsx     # Live community tribute feed showing messages left by others
app/
├── page.js                  # Primary altar dashboard bringing components together
└── layout.js                # Default root layout
```

---

## 7. Phased Antigravity Prompts

### Phase 1: Database & OpenRouter Engine
> *"Read `BUILD_PLAN.md`. Set up the core backend for LegacySéance:*
> *1. Create `lib/mongodb.js` for MongoDB connection pooling.*
> *2. Create `lib/ai-engine.js` routing persona summoning to Google Gemma via OpenRouter.*
> *3. Create `app/api/shrines/route.js` with auto-seeding for Flash, IE6, GeoCities, and Grace Hopper.*
> *4. Create `app/api/seance/route.js` and `app/api/offerings/route.js`.*
> *Review and apply changes."*

### Phase 2: Atmospheric Styles & Modular Components
> *"Read `BUILD_PLAN.md`. Implement the CSS and modular frontend components:*
> *1. Add the candle glow and CRT scanline animations to `app/globals.css`.*
> *2. Create `components/ofrenda/Header.jsx` and `components/ofrenda/ShrineCard.jsx`.*
> *3. Create `components/ofrenda/SeanceModal.jsx` featuring quick question starters and dialog history with Gemma.*
> *4. Create `components/ofrenda/OfferingDrawer.jsx` and `components/ofrenda/MemorialWall.jsx` with canvas-confetti upon placement.*
> *Review and apply changes."*

### Phase 3: Main Altar Assembly & Testing
> *"Read `BUILD_PLAN.md`. Implement `app/page.js`:*
> *1. Fetch shrines and community offerings on mount.*
> *2. Connect the Séance modal and Offering drawer with state updates.*
> *3. Verify complete flow by running `npm run dev` and testing a conversation with Macromedia Flash."*