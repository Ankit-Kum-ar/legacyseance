"use client";

import React, { useEffect, useState, useCallback } from "react";
import Header from "@/components/ofrenda/Header";
import ShrineCard from "@/components/ofrenda/ShrineCard";
import SeanceModal from "@/components/ofrenda/SeanceModal";
import OfferingDrawer from "@/components/ofrenda/OfferingDrawer";
import MemorialWall from "@/components/ofrenda/MemorialWall";
import { ShrineDocument } from "@/app/api/shrines/route";
import { OfferingDocument } from "@/app/api/offerings/route";
import { Flame, Sparkles, Ghost, Skull } from "lucide-react";

export default function Home() {
  const [shrines, setShrines] = useState<ShrineDocument[]>([]);
  const [offerings, setOfferings] = useState<OfferingDocument[]>([]);
  const [isLoadingShrines, setIsLoadingShrines] = useState(true);
  const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);

  // Modal active states
  const [activeSeanceShrine, setActiveSeanceShrine] = useState<ShrineDocument | null>(null);
  const [activeOfferingShrine, setActiveOfferingShrine] = useState<ShrineDocument | null>(null);

  // Fetch shrines from database
  const fetchShrines = useCallback(async () => {
    try {
      const res = await fetch("/api/shrines");
      const data = await res.json();
      if (data.success && data.shrines) {
        setShrines(data.shrines);
      }
    } catch (err) {
      console.error("Failed to load shrines:", err);
    } finally {
      setIsLoadingShrines(false);
    }
  }, []);

  // Fetch offerings from database
  const fetchOfferings = useCallback(async () => {
    try {
      const res = await fetch("/api/offerings");
      const data = await res.json();
      if (data.success && data.offerings) {
        setOfferings(data.offerings);
      }
    } catch (err) {
      console.error("Failed to load offerings:", err);
    } finally {
      setIsLoadingOfferings(false);
    }
  }, []);

  useEffect(() => {
    fetchShrines();
    fetchOfferings();
  }, [fetchShrines, fetchOfferings]);

  // Handle successful offering placement
  const handleOfferingSuccess = () => {
    fetchShrines();
    fetchOfferings();
  };

  // Calculate dynamic totals across all shrines
  const totalCandles = shrines.reduce(
    (sum, s) => sum + (s.stats?.candles || 0),
    0
  );

  const totalOfferings = shrines.reduce(
    (sum, s) =>
      sum +
      (s.stats?.candles || 0) +
      (s.stats?.floppies || 0) +
      (s.stats?.coffee || 0) +
      (s.stats?.marigolds || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C0E] text-[#EDEDED]">
      {/* Altar Header with Live Metrics */}
      <Header totalCandles={totalCandles} totalOfferings={totalOfferings} />

      {/* Main Altar Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:px-8">
        
        {/* Hero Altar Introduction */}
        <section className="relative text-center max-w-3xl mx-auto mb-12">
          {/* Subtle glowing halo */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF6B2C]/10 to-transparent blur-3xl -z-10" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#1A1D24] border border-[#2F3442] text-[#FF6B2C] mb-4">
            <Ghost className="w-3.5 h-3.5 animate-bounce" />
            Hacktoberfest 2026: Ghost in the Machine
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            The Digital <span className="text-[#FF6B2C]">Ofrenda</span> for Lost Tech
          </h2>

          <p className="text-base text-zinc-400 leading-relaxed">
            Welcome, traveler. Here lie the pioneers, languages, and wild innovations that built the early web.
            Step into the séance chamber to speak with their spirits, light a candle, or leave a symbolic offering before they fade forever into the digital ether.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Skull className="w-3.5 h-3.5 text-[#FF6B2C]" /> Día de los Muertos Edition
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Interactive Spirit Summoning
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-emerald-400" /> Real-Time Memorial Ledger
            </span>
          </div>
        </section>

        {/* Shrines Memorial Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🏛️</span> Memorial Shrines
            </h3>
            <span className="text-xs text-zinc-500">
              {shrines.length} departed technologies remembered
            </span>
          </div>

          {isLoadingShrines ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-[#15171C] border border-[#232730] p-6 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="h-6 w-1/2 bg-[#232730] rounded-lg" />
                    <div className="h-4 w-3/4 bg-[#1F232B] rounded-lg" />
                  </div>
                  <div className="h-10 bg-[#1F232B] rounded-xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shrines.map((shrine) => (
                <ShrineCard
                  key={shrine.slug}
                  shrine={shrine}
                  onSummon={(s) => setActiveSeanceShrine(s)}
                  onOffer={(s) => setActiveOfferingShrine(s)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Community Memorial Wall */}
        <MemorialWall offerings={offerings} isLoading={isLoadingOfferings} />

      </main>

      {/* Footer */}
      <footer className="border-t border-[#232730] bg-[#0E1015] py-8 text-center text-xs text-zinc-500">
        <p className="flex items-center justify-center gap-2">
          <span>Built with</span>
          <span className="text-[#FF6B2C]">🕯️</span>
          <span>to honor the pioneers, languages, and tools of the early web.</span>
        </p>
        <p className="mt-1 text-zinc-600">
          May our deprecated code rest peacefully in read-only repositories.
        </p>
      </footer>

      {/* Interactive Modals */}
      <SeanceModal
        shrine={activeSeanceShrine}
        isOpen={!!activeSeanceShrine}
        onClose={() => setActiveSeanceShrine(null)}
      />

      <OfferingDrawer
        shrine={activeOfferingShrine}
        isOpen={!!activeOfferingShrine}
        onClose={() => setActiveOfferingShrine(null)}
        onSuccess={handleOfferingSuccess}
      />
    </div>
  );
}
