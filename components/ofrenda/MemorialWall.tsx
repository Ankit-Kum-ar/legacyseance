"use client";

import React from "react";
import { Scroll, Flame } from "lucide-react";
import { OfferingDocument } from "@/app/api/offerings/route";

interface MemorialWallProps {
  offerings: OfferingDocument[];
  isLoading: boolean;
}

export default function MemorialWall({ offerings, isLoading }: MemorialWallProps) {
  return (
    <section className="w-full mt-12 pt-8 border-t border-[#232730]">
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B1E26] text-[#FF6B2C]">
            <Scroll className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Community Memorial Wall
            </h2>
            <p className="text-xs text-zinc-400">
              Live tributes and memories left by engineers worldwide
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1A1D24] border border-[#2A2E39] text-zinc-300">
          {offerings.length} Eulogies Inscribed
        </span>
      </div>

      {/* Offerings Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-zinc-500 text-sm">
          <Flame className="w-5 h-5 animate-spin mr-2 text-[#FF6B2C]" />
          Gathering collective tributes from the digital ofrenda...
        </div>
      ) : offerings.length === 0 ? (
        <div className="text-center p-12 rounded-2xl bg-[#14161C] border border-[#232730] text-zinc-400 text-sm">
          No offerings have been placed yet. Be the first hacker to light a candle or leave a floppy! 🕯️
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offerings.map((item, index) => {
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric"
                })
              : "Recently";

            return (
              <div
                key={index}
                className="relative flex flex-col justify-between p-4 rounded-xl bg-[#14171F] border border-[#232730] hover:border-zinc-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg select-none">{item.icon || "🕯️"}</span>
                      <span className="text-xs font-semibold text-zinc-300 truncate max-w-[130px]">
                        {item.author || "Anonymous"}
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-500 font-mono">
                      {dateStr}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 italic leading-relaxed line-clamp-3">
                    &ldquo;{item.eulogy}&rdquo;
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-[#1F232B] flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Honoring:</span>
                  <span className="text-[#FF6B2C] font-semibold truncate max-w-[150px]">
                    {item.shrineName || item.shrineSlug}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
