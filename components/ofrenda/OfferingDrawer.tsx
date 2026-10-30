"use client";

import React, { useState } from "react";
import { X, Flame, HeartHandshake, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { ShrineDocument } from "@/app/api/shrines/route";

interface OfferingDrawerProps {
  shrine: ShrineDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TRIBUTES = [
  {
    type: "candle",
    title: "Candle",
    icon: "🕯️",
    desc: "Light an eternal flame of remembrance"
  },
  {
    type: "floppy",
    title: "3.5\" Floppy",
    icon: "💾",
    desc: "Preserve 1.44MB of sacred legacy bytes"
  },
  {
    type: "coffee",
    title: "Coffee Mug",
    icon: "☕",
    desc: "Honoring 3 AM bug-fixing marathons"
  },
  {
    type: "marigold",
    title: "Marigold",
    icon: "🌼",
    desc: "Traditional cempasúchil guiding departed code"
  }
];

export default function OfferingDrawer({
  shrine,
  isOpen,
  onClose,
  onSuccess
}: OfferingDrawerProps) {
  const [selectedType, setSelectedType] = useState<string>("candle");
  const [author, setAuthor] = useState("");
  const [eulogy, setEulogy] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !shrine) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eulogy.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/offerings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shrineSlug: shrine.slug,
          author: author.trim() || "Anonymous Hacker",
          type: selectedType,
          eulogy: eulogy.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        // Trigger celebratory Halloween & Ofrenda confetti
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FF6B2C", "#F59E0B", "#10B981", "#8B5CF6"]
        });

        setAuthor("");
        setEulogy("");
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error("Failed to submit offering:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0F1116] border border-[#2A2E39] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#232730] bg-[#14161C]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#20242E] text-[#FF6B2C]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Place an Offering</h3>
              <p className="text-xs text-zinc-400">
                Honoring {shrine.name} ({shrine.lifespan})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#232730] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Selectable Tribute Type Grid */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
              1. Choose Symbolic Tribute
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {TRIBUTES.map((t) => {
                const isSelected = selectedType === t.type;
                return (
                  <button
                    key={t.type}
                    type="button"
                    onClick={() => setSelectedType(t.type)}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#FF6B2C]/10 border-[#FF6B2C] shadow-md shadow-[#FF6B2C]/10"
                        : "bg-[#14171F] border-[#232730] hover:border-zinc-700"
                    }`}
                  >
                    <span className="text-2xl select-none">{t.icon}</span>
                    <div>
                      <div className={`text-xs font-bold ${isSelected ? "text-white" : "text-zinc-300"}`}>
                        {t.title}
                      </div>
                      <div className="text-[10px] text-zinc-500 leading-snug mt-0.5">
                        {t.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Author Name Field */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              2. Your Name or Moniker
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Alex (Web Dev since 1999)"
              className="w-full px-4 py-2.5 rounded-xl bg-[#14171F] border border-[#232730] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-all"
            />
          </div>

          {/* Eulogy Textarea */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
              3. One-Sentence Eulogy or Memory
            </label>
            <textarea
              required
              rows={3}
              value={eulogy}
              onChange={(e) => setEulogy(e.target.value)}
              placeholder="e.g. Thank you for teaching me how to code ActionScript in computer lab..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#14171F] border border-[#232730] text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !eulogy.trim()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF6B2C] hover:bg-[#FF7A42] text-white font-semibold text-sm disabled:opacity-50 transition-transform active:scale-[0.99] cursor-pointer shadow-lg shadow-[#FF6B2C]/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Inscribing on the Ofrenda...
              </>
            ) : (
              <>
                <Flame className="w-4 h-4" /> Place Tribute on Altar
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
