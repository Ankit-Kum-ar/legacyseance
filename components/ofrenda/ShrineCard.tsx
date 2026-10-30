"use client";

import React from "react";
import { Sparkles, MessageSquare, HeartHandshake } from "lucide-react";
import { ShrineDocument } from "@/app/api/shrines/route";

interface ShrineCardProps {
  shrine: ShrineDocument;
  onSummon: (shrine: ShrineDocument) => void;
  onOffer: (shrine: ShrineDocument) => void;
}

export default function ShrineCard({ shrine, onSummon, onOffer }: ShrineCardProps) {
  const stats = shrine.stats || { candles: 0, floppies: 0, coffee: 0, marigolds: 0 };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-[#15171C] border border-[#232730] p-6 hover:border-[#FF6B2C]/50 hover:shadow-xl hover:shadow-[#FF6B2C]/10 transition-all duration-300">
      {/* Background ambient pulse on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6B2C]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        {/* Header: Tech Name & Lifespan Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-bold text-white group-hover:text-[#FF6B2C] transition-colors">
            {shrine.name}
          </h3>
          <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#232730] text-zinc-300 border border-[#2F3442]">
            {shrine.lifespan}
          </span>
        </div>

        {/* Epitaph */}
        <p className="text-sm text-zinc-400 italic leading-relaxed mb-6">
          &ldquo;{shrine.epitaph}&rdquo;
        </p>

        {/* Community Offering Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#0E1015] border border-[#232730]">
            <span className="text-lg select-none mb-0.5 animate-pulse">🕯️</span>
            <span className="text-xs font-bold text-zinc-200">{stats.candles || 0}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Flames</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#0E1015] border border-[#232730]">
            <span className="text-lg select-none mb-0.5">💾</span>
            <span className="text-xs font-bold text-zinc-200">{stats.floppies || 0}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Disks</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#0E1015] border border-[#232730]">
            <span className="text-lg select-none mb-0.5">☕</span>
            <span className="text-xs font-bold text-zinc-200">{stats.coffee || 0}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Coffee</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#0E1015] border border-[#232730]">
            <span className="text-lg select-none mb-0.5">🌼</span>
            <span className="text-xs font-bold text-zinc-200">{stats.marigolds || 0}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Flora</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#232730]">
        <button
          onClick={() => onSummon(shrine)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm bg-[#FF6B2C] hover:bg-[#FF7A42] text-white shadow-md shadow-[#FF6B2C]/20 transition-transform active:scale-[0.98] cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" /> Summon Spirit
        </button>

        <button
          onClick={() => onOffer(shrine)}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs sm:text-sm bg-[#1F232B] hover:bg-[#2A2E39] text-zinc-200 border border-[#2F3442] hover:text-white transition-colors cursor-pointer"
        >
          <HeartHandshake className="w-4 h-4 text-[#FF6B2C]" /> Make Tribute
        </button>
      </div>
    </div>
  );
}
