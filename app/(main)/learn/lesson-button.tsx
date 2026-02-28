"use client";

import { Check, Lock } from "lucide-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { cn } from "@/lib/utils";
import "react-circular-progressbar/dist/styles.css";

type LessonButtonProps = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
  subject?: string;
};

// Decorative space objects floating beside lessons
const SPACE_DECOS = ["🪐", "⭐", "☄️", "🌙", "💫", "🛸", "🌌", "🪨"];
const SIDE_DECOS  = ["🚀", "👾", "🌠", "✨", "🛰️", "🔭", "💥", "🌟"];

const SUBJECT_CONFIG: Record<string, { icon: string; color: string; glow: string }> = {
  ROBOTICS:            { icon: "🤖", color: "#22d3ee", glow: "rgba(34,211,238,0.5)" },
  MATH:                { icon: "🔢", color: "#a78bfa", glow: "rgba(167,139,250,0.5)" },
  SCIENCE:             { icon: "🧪", color: "#34d399", glow: "rgba(52,211,153,0.5)" },
  ENGLISH:             { icon: "🇺🇸", color: "#60a5fa", glow: "rgba(96,165,250,0.5)" },
  PORTUGUESE:          { icon: "🇧🇷", color: "#4ade80", glow: "rgba(74,222,128,0.5)" },
  ASTRONOMY:           { icon: "🌌", color: "#818cf8", glow: "rgba(129,140,248,0.5)" },
  "FINANCE INFLUENCE": { icon: "💰", color: "#fbbf24", glow: "rgba(251,191,36,0.5)" },
  DEFAULT:             { icon: "⭐", color: "#a78bfa", glow: "rgba(167,139,250,0.5)" },
};

export const LessonButton = ({ id, index, totalCount, locked, current, percentage, subject = "DEFAULT" }: LessonButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;
  let indent = 0;
  if (cycleIndex <= 2) indent = cycleIndex;
  else if (cycleIndex <= 4) indent = 4 - cycleIndex;
  else if (cycleIndex <= 6) indent = 4 - cycleIndex;
  else indent = cycleIndex - 8;

  const rightPosition = indent * 44;
  const isCompleted = !current && !locked;
  const cfg = SUBJECT_CONFIG[subject] || SUBJECT_CONFIG.DEFAULT;
  const deco = SPACE_DECOS[index % SPACE_DECOS.length];
  const sideDeco = SIDE_DECOS[index % SIDE_DECOS.length];

  const href = isCompleted || current ? `/lesson/${id}` : "#";

  return (
    <Link href={href} aria-disabled={locked && !current} style={{ pointerEvents: locked && !current ? "none" : "auto" }}>
      <div className="relative flex flex-col items-center" style={{ right: `${rightPosition}px`, marginTop: index === 0 && !isCompleted ? 56 : 28 }}>

        {/* Floating side deco */}
        <div className="absolute text-xl select-none pointer-events-none animate-bounce"
          style={{ right: `${-50 + (index % 2) * 6}px`, top: "4px", animationDuration: `${2.5 + (index % 3) * 0.6}s`, animationDelay: `${(index % 5) * 0.3}s`, filter: "drop-shadow(0 0 6px rgba(167,139,250,0.4))" }}>
          {sideDeco}
        </div>

        {/* Between-lesson deco */}
        {index < totalCount && (
          <div className="absolute text-2xl select-none pointer-events-none"
            style={{ top: "calc(100% + 6px)", left: `${-44 + (index % 3) * 18}px`, filter: "drop-shadow(0 0 8px rgba(34,211,238,0.3))" }}>
            {deco}
          </div>
        )}

        {/* CURRENT */}
        {current && (
          <div className="relative" style={{ width: 120, height: 120 }}>
            {/* Pulse rings */}
            <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: cfg.color }} />
            <div className="absolute inset-0 rounded-full animate-ping opacity-10" style={{ backgroundColor: cfg.color, animationDelay: "0.5s" }} />

            {/* "START" bubble */}
            <div className="absolute -top-11 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-extrabold tracking-wider"
              style={{ background: `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color}88)`, color: "#0f172a", boxShadow: `0 4px 16px ${cfg.glow}`, border: `1px solid ${cfg.color}` }}>
              🚀 INICIAR!
              <div className="absolute -bottom-[7px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent" style={{ borderTopColor: cfg.color }} />
            </div>

            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: { stroke: cfg.color, strokeWidth: 7, strokeLinecap: "round" },
                trail: { stroke: "rgba(255,255,255,0.06)", strokeWidth: 7 },
              }}
            >
              <button
                className="relative flex h-[84px] w-[84px] items-center justify-center rounded-full text-5xl transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
                  border: `3px solid ${cfg.color}`,
                  boxShadow: `0 0 24px ${cfg.glow}, 0 4px 0 rgba(0,0,0,0.4)`,
                }}
              >
                {cfg.icon}
              </button>
            </CircularProgressbarWithChildren>
          </div>
        )}

        {/* COMPLETED */}
        {isCompleted && (
          <div className="relative" style={{ width: 72, height: 72 }}>
            <button
              className="h-[72px] w-[72px] rounded-full text-4xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #1e3a2f, #0f2d24)",
                border: `2.5px solid #4ade80`,
                boxShadow: "0 0 12px rgba(74,222,128,0.3), 0 3px 0 rgba(0,0,0,0.4)",
              }}
            >
              {cfg.icon}
            </button>
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full"
              style={{ background: "#4ade80", border: "2px solid #0f172a", boxShadow: "0 0 6px rgba(74,222,128,0.5)" }}>
              <Check className="h-3 w-3 stroke-[3]" style={{ color: "#0f172a" }} />
            </div>
          </div>
        )}

        {/* LOCKED */}
        {locked && !current && (
          <div className="relative" style={{ width: 72, height: 72 }}>
            <button
              className="h-[72px] w-[72px] rounded-full flex items-center justify-center opacity-50"
              style={{
                background: "linear-gradient(135deg, #1e2030, #0f172a)",
                border: "2.5px solid rgba(148,163,184,0.3)",
              }}
            >
              <Lock className="h-7 w-7 stroke-[2.5]" style={{ color: "#475569" }} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};