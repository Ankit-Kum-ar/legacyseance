# 🕯️ LegacySéance — The Digital Ofrenda for Lost Tech

> **The Digital Ofrenda & Interactive Séance Chamber for Retired Software and Computing Legends**  
> *Built for Hacktoberfest 2026 Week 4: "Ghost in the Machine" (Halloween & Día de los Muertos)*

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/Ankit-Kum-ar/legacyseance)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=flat&logo=vercel)](https://legacyseance.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.4_Turbopack-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Google Gemma AI](https://img.shields.io/badge/Google_Gemma-2_27B_--_Open_Weights-4285F4?style=flat&logo=google)](https://ai.google.dev/gemma)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Live Demo & Links

- **🌐 Live Deployed Application:** [https://legacyseance.vercel.app](https://legacyseance.vercel.app)
- **💻 GitHub Source Repository:** [https://github.com/Ankit-Kum-ar/legacyseance](https://github.com/Ankit-Kum-ar/legacyseance)

---

## 📌 Problem Statement: The Tech Graveyard Dilemma

Deprecated software and computing pioneers vanish into forgotten 404 archives. Modern developers spend countless hours wrestling 40MB JavaScript bundles while laughing at the software that built the foundation of the web:

- **Macromedia / Adobe Flash** (1996 — 2020): The creative wild frontier of vector animations and Newgrounds games.
- **Internet Explorer 6** (2001 — 2022): The misunderstood titan of proprietary rendering bugs and the CSS box model.
- **GeoCities** (1994 — 2009): The golden era of neon Comic Sans, visitor guestbooks, and under-construction GIFs.
- **Rear Admiral Grace Hopper** (1906 — 1992): The pioneer who pulled the first literal bug out of Relay #70 and created human-readable compilers.

**LegacySéance** creates an interactive, candlelit digital altar (*ofrenda*) honoring them.

---

## 💡 The Core Innovation: The Digital Ofrenda & CRT Séance Chamber

```text
                                 [ Hacker Enters Altar ]
                                            │
                                            ▼
                     ┌─────────────────────────────────────────────┐
                     │         🏛️ Memorial Shrine Altar            │
                     │  (Lifespans, Epitaphs, Community Counters)   │
                     └──────────────────────┬──────────────────────┘
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
       🔮 [ SUMMON SPIRIT ]                            🕯️ [ PLACE TRIBUTE ]
       Retro CRT scanline terminal                     Choose: Candle, Floppy, Coffee, Marigold
       Gemma 2 27B speaks in-character                 Submit 1-sentence eulogy with confetti
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            ▼
                     ┌─────────────────────────────────────────────┐
                     │           🍃 MongoDB Atlas Cloud            │
                     │     Atomic $inc Counters & Eulogy Feed      │
                     └─────────────────────────────────────────────┘
```

1. **🏛️ The Ofrenda Altar:** Interactive memorial cards with tribute statistics (Candles 🕯️, 3.5" Floppies 💾, Coffee Cups ☕, Marigolds 🌼).
2. **🔮 The CRT Séance Chamber:** Retro terminal window where **Google Gemma 2 27B** open weights roleplays the spirit in real-time.
3. **🕯️ Symbolic Offerings:** Submit custom tributes with celebratory **Día de los Muertos confetti**.
4. **📜 Live Memorial Wall:** Real-time stream of collective developer eulogies stored in MongoDB Atlas.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (Turbopack, App Router, TypeScript)
- **AI Inference:** Google Gemma 2 27B via OpenRouter (`lib/ai-engine.ts`)
- **Database:** MongoDB Atlas with connection pooling (`lib/mongodb.ts`)
- **Styling:** Tailwind CSS v4 with custom `@keyframes candleGlow` and `.crt-scanlines`
- **Effects:** `lucide-react`, `canvas-confetti`

---

## ⚡ Getting Started Locally

```bash
# 1. Clone the repository
git clone https://github.com/Ankit-Kum-ar/legacyseance.git
cd legacyseance

# 2. Install dependencies
npm install

# 3. Configure environment variables in .env
MONGODB_URI="your_mongodb_connection_string"
OPENROUTER_API_KEY="your_openrouter_api_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 4. Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to enter the séance chamber.

---

## 📄 License

MIT License — Built with 🕯️ for Hacktoberfest 2026 Week 4: "Ghost in the Machine".
