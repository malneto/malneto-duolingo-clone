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

// Decorative mascots that appear between lessons on the trail
const TRAIL_MASCOTS = ["🦉", "🐸", "🦊", "🐙", "🦁", "🐼", "🦋", "🐬"];
const TRAIL_DECORATIONS = [
  { emoji: "🌺", offset: -55, top: 8 },
  { emoji: "⭐", offset: 58, top: 4 },
  { emoji: "🍀", offset: -52, top: 6 },
  { emoji: "🌸", offset: 60, top: 10 },
  { emoji: "🎯", offset: -58, top: 5 },
  { emoji: "💎", offset: 55, top: 8 },
  { emoji: "🌈", offset: -50, top: 6 },
  { emoji: "🎪", offset: 58, top: 4 },
];

const SUBJECT_CONFIG: Record<string, { icon: string; color: string; shadow: string; glow: string }> = {
  ROBOTICS:           { icon: "🤖", color: "from-blue-400 to-cyan-500",     shadow: "shadow-blue-300",   glow: "#3b82f6" },
  MATH:               { icon: "🔢", color: "from-violet-400 to-purple-500", shadow: "shadow-violet-300", glow: "#8b5cf6" },
  SCIENCE:            { icon: "🧪", color: "from-emerald-400 to-teal-500",  shadow: "shadow-emerald-300",glow: "#10b981" },
  ENGLISH:            { icon: "🇺🇸", color: "from-red-400 to-rose-500",    shadow: "shadow-red-300",    glow: "#ef4444" },
  PORTUGUESE:         { icon: "🇧🇷", color: "from-green-400 to-emerald-500",shadow: "shadow-green-300",  glow: "#22c55e" },
  ASTRONOMY:          { icon: "🌌", color: "from-indigo-500 to-purple-600", shadow: "shadow-indigo-300", glow: "#6366f1" },
  "FINANCE INFLUENCE":{ icon: "💰", color: "from-amber-400 to-yellow-500",  shadow: "shadow-amber-300",  glow: "#f59e0b" },
  DEFAULT:            { icon: "⭐", color: "from-green-400 to-emerald-500", shadow: "shadow-green-300",  glow: "#22c55e" },
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
  subject = "DEFAULT",
}: LessonButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;
  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 44;
  const isFirst = index === 0;
  const isCompleted = !current && !locked;
  const config = SUBJECT_CONFIG[subject] || SUBJECT_CONFIG.DEFAULT;
  const mascot = TRAIL_MASCOTS[index % TRAIL_MASCOTS.length];
  const deco = TRAIL_DECORATIONS[index % TRAIL_DECORATIONS.length];

  const href = isCompleted || current ? `/lesson/${id}` : "#";

  return (
    <Link
      href={href}
      aria-disabled={locked && !current}
      style={{ pointerEvents: locked && !current ? "none" : "auto" }}
    >
      <div
        className="relative flex flex-col items-center"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 56 : 28,
        }}
      >
        {/* Side decoration floating */}
        <div
          className="absolute text-2xl select-none pointer-events-none animate-bounce"
          style={{
            right: `${deco.offset}px`,
            top: `${deco.top}px`,
            animationDuration: `${2 + (index % 3) * 0.5}s`,
            animationDelay: `${(index % 4) * 0.3}s`,
          }}
        >
          {deco.emoji}
        </div>

        {/* Mascot between lessons */}
        {index < totalCount && (
          <div
            className="absolute text-3xl select-none pointer-events-none"
            style={{
              top: "calc(100% + 4px)",
              left: `${-40 + (index % 3) * 20}px`,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
            }}
          >
            {mascot}
          </div>
        )}

        {/* CURRENT lesson — big with pulse ring */}
        {current && (
          <div className="relative" style={{ width: 120, height: 120 }}>
            {/* Pulsing glow ring */}
            <div
              className="absolute inset-0 rounded-full animate-ping opacity-20"
              style={{ backgroundColor: config.glow }}
            />

            {/* START bubble */}
            <div
              className="absolute -top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-2xl px-5 py-2 font-extrabold text-white text-sm tracking-wide shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${config.glow}, ${config.glow}cc)`,
                boxShadow: `0 4px 20px ${config.glow}66`,
              }}
            >
              INICIAR! 🚀
              <div
                className="absolute -bottom-[7px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent"
                style={{ borderTopColor: config.glow }}
              />
            </div>

            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: { stroke: config.glow, strokeWidth: 7, strokeLinecap: "round" },
                trail: { stroke: "#e5e7eb99", strokeWidth: 7 },
              }}
            >
              <button
                className={cn(
                  "relative flex h-[84px] w-[84px] items-center justify-center rounded-full text-5xl",
                  "bg-white shadow-2xl border-4 border-white",
                  "transition-all duration-200 hover:scale-110 active:scale-95",
                )}
                style={{ boxShadow: `0 8px 24px ${config.glow}55, 0 4px 0 ${config.glow}` }}
              >
                {config.icon}
              </button>
            </CircularProgressbarWithChildren>
          </div>
        )}

        {/* COMPLETED lesson */}
        {isCompleted && (
          <div className="relative" style={{ width: 72, height: 72 }}>
            <button
              className={cn(
                "h-[72px] w-[72px] rounded-full text-4xl flex items-center justify-center",
                "bg-gradient-to-br from-green-400 to-emerald-500",
                "shadow-lg shadow-green-300 border-4 border-white",
                "transition-all duration-200 hover:scale-105 active:scale-95",
              )}
            >
              {config.icon}
            </button>
            {/* Checkmark badge */}
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md border-2 border-green-400">
              <Check className="h-3.5 w-3.5 text-green-500 stroke-[3]" />
            </div>
          </div>
        )}

        {/* LOCKED lesson */}
        {locked && !current && (
          <div className="relative" style={{ width: 72, height: 72 }}>
            <button
              className={cn(
                "h-[72px] w-[72px] rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-slate-300 to-slate-400",
                "shadow-md border-4 border-white",
                "opacity-70",
              )}
            >
              <Lock className="h-7 w-7 text-white stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};