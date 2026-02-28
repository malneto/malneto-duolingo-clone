"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
  matchGroup: number | null;
};

type Challenge = {
  id: number;
  type: string;
  question: string;
  challengeOptions: ChallengeOption[];
};

type MatchProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

const PAIR_COLORS = [
  { border: "rgba(34,211,238,0.6)",  bg: "rgba(34,211,238,0.08)",  glow: "rgba(34,211,238,0.2)"  },
  { border: "rgba(167,139,250,0.6)", bg: "rgba(167,139,250,0.08)", glow: "rgba(167,139,250,0.2)" },
  { border: "rgba(251,146,60,0.6)",  bg: "rgba(251,146,60,0.08)",  glow: "rgba(251,146,60,0.2)"  },
  { border: "rgba(244,114,182,0.6)", bg: "rgba(244,114,182,0.08)", glow: "rgba(244,114,182,0.2)" },
];

export const Match = ({ challenge, onSelect, status, disabled }: MatchProps) => {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [pairs, setPairs] = useState<Record<number, number>>({});

  const leftItems = challenge.challengeOptions.filter((opt) => !opt.correct);
  const rightItems = challenge.challengeOptions.filter((opt) => opt.correct);

  const handleLeftClick = (id: number) => {
    if (disabled || status !== "none") return;
    if (selectedLeft === id) { setSelectedLeft(null); return; }
    if (!pairs[id]) setSelectedLeft(id);
  };

  const handleRightClick = (id: number) => {
    if (disabled || status !== "none" || selectedLeft === null) return;
    const existingLeft = Object.keys(pairs).find((k) => pairs[Number(k)] === id);
    if (existingLeft) {
      setPairs((prev) => { const n = { ...prev }; delete n[Number(existingLeft)]; return n; });
      return;
    }
    const newPairs = { ...pairs, [selectedLeft]: id };
    setPairs(newPairs);
    setSelectedLeft(null);
    if (Object.keys(newPairs).length === leftItems.length) {
      const allCorrect = Object.entries(newPairs).every(([leftId, rightId]) => {
        const l = challenge.challengeOptions.find((o) => o.id === Number(leftId));
        const r = challenge.challengeOptions.find((o) => o.id === rightId);
        return l && r && l.matchGroup === r.matchGroup;
      });
      onSelect(allCorrect ? challenge.challengeOptions[0].id : -1);
    }
  };

  const getPairColor = (id: number) => {
    const pairIndex = Object.keys(pairs).indexOf(String(id));
    return pairIndex >= 0 ? PAIR_COLORS[pairIndex % PAIR_COLORS.length] : null;
  };

  return (
    <div className="space-y-6">
      <p className="text-center text-sm font-bold uppercase tracking-widest text-indigo-300">
        {challenge.question || "🔗 Conecte os pares"}
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* Left column */}
        <div className="space-y-3">
          {leftItems.map((item, i) => {
            const paired = getPairColor(item.id);
            const isSelected = selectedLeft === item.id;
            const col = paired ?? PAIR_COLORS[i % PAIR_COLORS.length];
            return (
              <button
                key={item.id}
                onClick={() => handleLeftClick(item.id)}
                disabled={disabled || status !== "none" || !!pairs[item.id]}
                className="w-full rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all duration-150 active:scale-[0.98] disabled:cursor-not-allowed"
                style={{
                  border: `2px solid ${isSelected ? "rgba(34,211,238,0.9)" : paired ? col.border : "rgba(99,102,241,0.3)"}`,
                  backgroundColor: isSelected ? "rgba(34,211,238,0.12)" : paired ? col.bg : "rgba(15,23,42,0.6)",
                  color: isSelected ? "#67e8f9" : paired ? col.border.replace("0.6", "1") : "#94a3b8",
                  boxShadow: isSelected ? "0 0 16px rgba(34,211,238,0.3)" : paired ? `0 0 12px ${col.glow}` : "none",
                  backdropFilter: "blur(8px)",
                  opacity: pairs[item.id] ? 0.7 : 1,
                }}
              >
                {item.text}
              </button>
            );
          })}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          {rightItems.map((item, i) => {
            const pairedLeftId = Object.keys(pairs).find((k) => pairs[Number(k)] === item.id);
            const paired = pairedLeftId ? getPairColor(Number(pairedLeftId)) : null;
            return (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                disabled={disabled || status !== "none"}
                className="w-full rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all duration-150 active:scale-[0.98]"
                style={{
                  border: `2px solid ${paired ? paired.border : "rgba(139,92,246,0.3)"}`,
                  backgroundColor: paired ? paired.bg : "rgba(15,23,42,0.6)",
                  color: paired ? paired.border.replace("0.6", "1") : "#94a3b8",
                  boxShadow: paired ? `0 0 12px ${paired.glow}` : "none",
                  backdropFilter: "blur(8px)",
                  opacity: paired ? 0.8 : 1,
                }}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};