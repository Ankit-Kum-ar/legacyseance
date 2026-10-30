"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Terminal, Loader2, Sparkles } from "lucide-react";
import { ShrineDocument } from "@/app/api/shrines/route";
import { Message } from "@/lib/ai-engine";

interface SeanceModalProps {
  shrine: ShrineDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

// Cleanly formats text paragraphs, bold tags, and strips raw asterisks
function renderFormattedContent(text: string) {
  // Clean out any lingering raw asterisks
  const cleaned = text
    .replace(/\*+/g, "")
    .trim();

  const paragraphs = cleaned.split(/\n\s*\n/);

  return (
    <div className="space-y-3 font-sans text-sm sm:text-base leading-relaxed text-zinc-200">
      {paragraphs.map((p, idx) => (
        <p key={idx} className="whitespace-normal">
          {p.trim()}
        </p>
      ))}
    </div>
  );
}

export default function SeanceModal({ shrine, isOpen, onClose }: SeanceModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or reset conversation when a new shrine is summoned
  useEffect(() => {
    if (shrine && isOpen) {
      setMessages([
        {
          role: "assistant",
          content: `*The candle flame gutters and turns phosphor green... You feel the ethereal presence of ${shrine.name} (${shrine.lifespan}). Ask what you will of the past.*`
        }
      ]);
      setInput("");
    }
  }, [shrine, isOpen]);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen || !shrine) return null;

  const handleSend = async (questionText?: string) => {
    const question = (questionText || input).trim();
    if (!question || isLoading) return;

    const userMessage: Message = { role: "user", content: question };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/seance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shrineSlug: shrine.slug,
          userQuestion: question,
          history: messages.filter((m) => m.role !== "system")
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages([...newHistory, { role: "assistant", content: data.reply }]);
      } else {
        setMessages([
          ...newHistory,
          {
            role: "assistant",
            content: "*A chill wind blows out the candle flame. The spirit was unreachable in the ether...*"
          }
        ]);
      }
    } catch (err) {
      console.error("Séance invocation error:", err);
      setMessages([
        ...newHistory,
        {
          role: "assistant",
          content: "*Static crackles across the séance connection. Please summon again.*"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0D0F12] border border-[#FF6B2C]/40 shadow-2xl shadow-[#FF6B2C]/15 flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#232730] bg-[#14161C]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#20242E] text-[#FF6B2C]">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">
                  Séance Chamber: {shrine.name}
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-xs text-zinc-400">
                Attuning spiritual frequency across the ether • Terminal Active
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#232730] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CRT Scanline Terminal Window */}
        <div className="relative flex-1 overflow-y-auto p-5 crt-scanlines bg-[#08090C] font-mono text-sm space-y-4 min-h-[300px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <div className="text-[11px] text-zinc-500 mb-1 flex items-center gap-1 font-sans">
                {msg.role === "user" ? (
                  <span>Hacker (You)</span>
                ) : (
                  <span className="text-[#FF6B2C] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> {shrine.name}
                  </span>
                )}
              </div>

              <div
                className={`max-w-[92%] rounded-2xl px-5 py-4 leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#FF6B2C] text-white shadow-lg shadow-[#FF6B2C]/20"
                    : "bg-[#13161D] border border-[#232730] shadow-xl"
                }`}
              >
                {renderFormattedContent(msg.content)}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-zinc-400 italic font-sans py-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF6B2C]" />
              The candle flame flickers as {shrine.name} channels through the void...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompt Chips */}
        {shrine.defaultPrompts && shrine.defaultPrompts.length > 0 && (
          <div className="px-5 py-2.5 bg-[#12141A] border-t border-[#232730] flex flex-wrap gap-1.5">
            <span className="text-[11px] text-zinc-400 self-center mr-1">Suggested:</span>
            {shrine.defaultPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1 rounded-full bg-[#1A1E26] hover:bg-[#252A36] text-zinc-300 hover:text-white border border-[#2F3442] transition-colors cursor-pointer disabled:opacity-50"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        )}

        {/* Message Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-4 bg-[#14161C] border-t border-[#232730]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Speak to the spirit of ${shrine.name}...`}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#0D0F12] border border-[#2A2E39] text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#FF6B2C] focus:ring-1 focus:ring-[#FF6B2C] transition-all"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center p-2.5 rounded-xl bg-[#FF6B2C] hover:bg-[#FF7A42] text-white disabled:opacity-50 transition-transform active:scale-95 cursor-pointer shadow-md shadow-[#FF6B2C]/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
