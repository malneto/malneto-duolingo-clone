"use client";

import { getStreakState } from "@/lib/streak-state";

type StreakProps = {
  currentStreak: number;
  longestStreak?: number;
  lastActivityDate?: string | null;
};

// Flame SVG that changes shape/opacity based on health
function Flame({ color, duration }: { color: string; duration: string }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 44, height: 44 }}>
      {/* Outer glow pulse */}
      <div
        className="absolute rounded-full animate-ping"
        style={{
          inset: 4,
          background: color,
          opacity: 0.15,
          animationDuration: duration,
        }}
      />
      {/* Main flame emoji with flicker */}
      <span
        className="relative text-3xl"
        style={{
          filter: `drop-shadow(0 0 8px ${color})`,
          animation: `flicker ${duration} ease-in-out infinite alternate`,
        }}
      >
        🔥
      </span>

      <style>{`
        @keyframes flicker {
          0%   { opacity: 1;    transform: scale(1)    rotate(-2deg); }
          25%  { opacity: 0.85; transform: scale(1.06) rotate(1deg);  }
          50%  { opacity: 1;    transform: scale(0.95) rotate(-1deg); }
          75%  { opacity: 0.9;  transform: scale(1.04) rotate(2deg);  }
          100% { opacity: 1;    transform: scale(1)    rotate(0deg);  }
        }
      `}</style>
    </div>
  );
}

export const Streak = ({
  currentStreak,
  longestStreak = 0,
  lastActivityDate,
}: StreakProps) => {
  const state = getStreakState(currentStreak, lastActivityDate);
  const isDead = state.health === "dead";

  return (
    <div
      className="flex flex-col gap-3 rounded-2xl px-5 py-4"
      style={{
        background: `linear-gradient(135deg, ${state.color}18, rgba(15,23,42,0.8))`,
        border: `1.5px solid ${state.color}55`,
        boxShadow: `0 0 20px ${state.glow}`,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Main row */}
      <div className="flex items-center gap-3">
        {isDead ? (
          <span className="text-4xl opacity-40">🚀</span>
        ) : (
          <Flame color={state.color} duration={state.animDuration} />
        )}

        <div className="flex-1">
          <p
            className="text-2xl font-extrabold leading-none"
            style={{ color: state.color }}
          >
            {currentStreak}
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            dias seguidos
          </p>
        </div>

        {longestStreak > 0 && (
          <div className="pl-4" style={{ borderLeft: `1px solid ${state.color}33` }}>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Recorde
            </p>
            <p className="text-sm font-extrabold" style={{ color: state.color }}>
              {longestStreak}d
            </p>
          </div>
        )}
      </div>

      {/* Health bar */}
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-xs font-bold" style={{ color: state.color }}>
            {state.label}
          </span>
          <span className="text-xs text-slate-500">{state.healthPct}%</span>
        </div>
        <div
          className="relative h-2 w-full overflow-hidden rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${state.healthPct}%`,
              background: `linear-gradient(90deg, ${state.color}99, ${state.color})`,
              boxShadow: `0 0 8px ${state.glow}`,
            }}
          />
        </div>
      </div>

      {/* Warning message for danger/critical */}
      {(state.health === "danger" || state.health === "critical") && (
        <p
          className="text-center text-xs font-bold animate-pulse"
          style={{ color: state.color }}
        >
          {state.health === "critical"
            ? "⚠️ Complete um desafio agora para salvar seu streak!"
            : "⚡ Faça ao menos 1 desafio hoje para não perder pontos!"}
        </p>
      )}

      {isDead && currentStreak === 0 && (
        <p className="text-center text-xs text-slate-500">
          Reinicie sua sequência completando um desafio 🚀
        </p>
      )}
    </div>
  );
};