"use client";

import { challengeOptions } from "@/db/schema";
import { cn } from "@/lib/utils";
import { speakEN } from "./character-bubble";

type ChallengeProps = {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: string;
};

const SPACE_COLORS = [
  { border: "#22d3ee", bg: "rgba(34,211,238,0.08)",  text: "#67e8f9", glow: "rgba(34,211,238,0.25)" },
  { border: "#a78bfa", bg: "rgba(167,139,250,0.08)", text: "#c4b5fd", glow: "rgba(167,139,250,0.25)" },
  { border: "#fb923c", bg: "rgba(251,146,60,0.08)",  text: "#fdba74", glow: "rgba(251,146,60,0.25)" },
  { border: "#f472b6", bg: "rgba(244,114,182,0.08)", text: "#f9a8d4", glow: "rgba(244,114,182,0.25)" },
];

export const Challenge = ({ options, onSelect, status, selectedOption, disabled, type }: ChallengeProps) => {
  return (
    <div className={cn("grid gap-3", type === "ASSIST" && "grid-cols-1", type === "SELECT" && "grid-cols-2")}>
      {options.map((option, i) => {
        const isSelected = selectedOption === option.id;
        const col = SPACE_COLORS[i % SPACE_COLORS.length];
        const borderColor = isSelected && status === "correct" ? "#4ade80" : isSelected && status === "wrong" ? "#f87171" : isSelected ? "#fff" : col.border;
        const bgColor = isSelected && status === "correct" ? "rgba(74,222,128,0.12)" : isSelected && status === "wrong" ? "rgba(248,113,113,0.12)" : isSelected ? "rgba(255,255,255,0.1)" : col.bg;
        const textColor = isSelected && status === "correct" ? "#86efac" : isSelected && status === "wrong" ? "#fca5a5" : isSelected ? "#fff" : col.text;

        return (
          <button
            key={option.id}
            onClick={() => {
              if (disabled) return;
              onSelect(option.id);
              if (type === "SELECT" || type === "ASSIST") speakEN(option.text);
            }}
            disabled={disabled}
            className={cn("relative flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left font-bold transition-all duration-150 active:scale-[0.98]", !isSelected && status !== "none" && "opacity-40", disabled && "cursor-not-allowed")}
            style={{ borderColor, backgroundColor: bgColor, color: textColor, boxShadow: isSelected ? `0 0 18px ${status === "correct" ? "rgba(74,222,128,0.4)" : status === "wrong" ? "rgba(248,113,113,0.4)" : "rgba(255,255,255,0.2)"}` : `0 0 8px ${col.glow}` }}
          >
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-extrabold"
              style={{ border: `1.5px solid ${borderColor}`, backgroundColor: isSelected ? borderColor : "transparent", color: isSelected ? "#0f172a" : textColor }}>
              {i + 1}
            </div>
            <span className="flex-1 text-sm lg:text-base">{option.text}</span>
            {isSelected && status === "correct" && <span className="text-lg">✅</span>}
            {isSelected && status === "wrong" && <span className="text-lg">❌</span>}
          </button>
        );
      })}
    </div>
  );
};