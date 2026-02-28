type StreakProps = {
  currentStreak: number;
  longestStreak?: number;
};

export const Streak = ({ currentStreak, longestStreak = 0 }: StreakProps) => {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-5 py-3"
      style={{
        background: "linear-gradient(135deg, rgba(251,146,60,0.1), rgba(15,23,42,0.7))",
        border: "1.5px solid rgba(251,146,60,0.3)",
        boxShadow: "0 0 16px rgba(251,146,60,0.12)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span className="text-3xl" style={{ filter: "drop-shadow(0 0 8px rgba(251,146,60,0.6))" }}>
        🔥
      </span>

      <div>
        <p className="text-2xl font-extrabold leading-none" style={{ color: "#fdba74" }}>
          {currentStreak}
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#94a3b8" }}>
          dias seguidos
        </p>
      </div>

      {longestStreak > 0 && (
        <div
          className="ml-3 pl-4"
          style={{ borderLeft: "1px solid rgba(251,146,60,0.2)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#64748b" }}>
            Recorde
          </p>
          <p className="text-sm font-extrabold" style={{ color: "#fdba74" }}>
            {longestStreak} dias
          </p>
        </div>
      )}
    </div>
  );
};