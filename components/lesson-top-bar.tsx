"use client";

import Link from "next/link";
import Image from "next/image";
import { getStreakState } from "@/lib/streak-state";

type LessonTopBarProps = {
  hearts: number;
  points: number;
  currentStreak: number;
  hasActiveSubscription: boolean;
  lastActivityDate?: string | null;
};

export const LessonTopBar = ({
  hearts,
  points,
  currentStreak,
  hasActiveSubscription,
  lastActivityDate,
}: LessonTopBarProps) => {
  const streak = getStreakState(currentStreak, lastActivityDate);
  const isDead = streak.health === "dead";

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(10,14,26,0.92)",
        borderBottom: "1px solid rgba(99,102,241,0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="mx-auto max-w-[1140px] px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Course flag */}
        <Link href="/courses" className="flex-shrink-0">
          <div
            className="h-9 w-9 overflow-hidden rounded-full transition hover:scale-110 active:scale-95"
            style={{
              border: "2px solid rgba(99,102,241,0.5)",
              boxShadow: "0 0 8px rgba(99,102,241,0.3)",
            }}
          >
            <Image
              src="https://flagcdn.com/w320/us.png"
              alt="Inglês"
              height={36}
              width={36}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Hearts */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(248,113,113,0.12)",
              border: "1px solid rgba(248,113,113,0.3)",
            }}
          >
            <span className="text-base">❤️</span>
            <span className="font-extrabold text-sm" style={{ color: "#fca5a5" }}>
              {hasActiveSubscription ? "∞" : hearts}
            </span>
          </div>

          {/* XP */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{
              background: "rgba(251,191,36,0.12)",
              border: "1px solid rgba(251,191,36,0.3)",
            }}
          >
            <span className="text-base">⚡</span>
            <span className="font-extrabold text-sm" style={{ color: "#fcd34d" }}>
              {points.toLocaleString()}
            </span>
          </div>

          {/* Streak — animated flame */}
          <div
            className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 overflow-hidden"
            style={{
              background: `${streak.color}18`,
              border: `1px solid ${streak.color}44`,
              boxShadow: streak.health !== "dead" ? `0 0 10px ${streak.glow}` : "none",
            }}
          >
            {/* Animated flame icon */}
            <span
              className="text-base relative"
              style={{
                display: "inline-block",
                filter: isDead
                  ? "grayscale(1) opacity(0.4)"
                  : `drop-shadow(0 0 5px ${streak.color})`,
                animation: isDead
                  ? "none"
                  : `topBarFlicker ${streak.animDuration} ease-in-out infinite alternate`,
              }}
            >
              {isDead ? "💀" : "🔥"}
            </span>

            <span
              className="font-extrabold text-sm"
              style={{ color: streak.color }}
            >
              {currentStreak}
            </span>

            {/* Critical pulse overlay */}
            {(streak.health === "critical" || streak.health === "danger") && (
              <span
                className="absolute inset-0 rounded-full animate-ping opacity-20"
                style={{ background: streak.color }}
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes topBarFlicker {
          0%   { opacity: 1;    transform: scale(1)    rotate(-3deg); }
          20%  { opacity: 0.8;  transform: scale(1.1)  rotate(2deg);  }
          40%  { opacity: 1;    transform: scale(0.92) rotate(-1deg); }
          60%  { opacity: 0.88; transform: scale(1.05) rotate(3deg);  }
          80%  { opacity: 1;    transform: scale(0.96) rotate(-2deg); }
          100% { opacity: 1;    transform: scale(1)    rotate(0deg);  }
        }
      `}</style>
    </div>
  );
};