"use client";

import React from "react";
import { Flame, Sparkles, Database, Cpu } from "lucide-react";

interface HeaderProps {
  totalCandles: number;
  totalOfferings: number;
}

export default function Header({ totalCandles, totalOfferings }: HeaderProps) {
  return (
    <header className="relative w-full border-b border-[#232730] bg-[#0E1015]/90 backdrop-blur-md px-4 py-8 sm:px-8">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B2C] to-transparent opacity-80" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Theme */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#1A1D24] border border-[#FF6B2C]/30 shadow-lg shadow-[#FF6B2C]/10">
            <span className="text-3xl animate-candle select-none">🕯️</span>
          </div>

          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Legacy<span className="text-[#FF6B2C]">Séance</span>
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30">
                <Sparkles className="w-3 h-3" /> Week 4
              </span>
            </div>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              The Digital Ofrenda & Séance Chamber for Retired Software and Computing Legends
            </p>
          </div>
        </div>

        {/* Global Altar Metrics & Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Flame Counter */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15171C] border border-[#2A2E39]">
            <Flame className="w-4 h-4 text-[#FF6B2C] animate-pulse" />
            <div className="text-left">
              <div className="text-xs text-zinc-400 font-medium">Candles Lit</div>
              <div className="text-sm font-bold text-white tracking-wide">
                {totalCandles > 0 ? totalCandles.toLocaleString() : "..."}
              </div>
            </div>
          </div>

          {/* Offerings Count */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#15171C] border border-[#2A2E39]">
            <span className="text-base select-none">🌼</span>
            <div className="text-left">
              <div className="text-xs text-zinc-400 font-medium">Tributes Left</div>
              <div className="text-sm font-bold text-white tracking-wide">
                {totalOfferings > 0 ? totalOfferings.toLocaleString() : "..."}
              </div>
            </div>
          </div>

          {/* Live Status Indicators */}
          <div className="hidden lg:flex flex-col gap-1.5 pl-3 border-l border-[#232730]">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ether Channel Active
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
              <Sparkles className="w-3 h-3 text-[#FF6B2C]" /> Eternal Memorial Ledger
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
