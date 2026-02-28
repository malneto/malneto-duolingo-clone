import Link from "next/link";
import Image from "next/image";

type LessonTopBarProps = {
  hearts: number;
  points: number;
  currentStreak: number;
  hasActiveSubscription: boolean;
};

export const LessonTopBar = ({ hearts, points, currentStreak, hasActiveSubscription }: LessonTopBarProps) => {
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
        {/* Flag */}
        <Link href="/courses" className="flex-shrink-0">
          <div className="h-9 w-9 overflow-hidden rounded-full transition hover:scale-110 active:scale-95"
            style={{ border: "2px solid rgba(99,102,241,0.5)", boxShadow: "0 0 8px rgba(99,102,241,0.3)" }}>
            <Image src="https://flagcdn.com/w320/us.png" alt="Inglês" height={36} width={36} className="h-full w-full object-cover" />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {/* Hearts */}
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)" }}>
            <span className="text-base">❤️</span>
            <span className="font-extrabold text-sm" style={{ color: "#fca5a5" }}>
              {hasActiveSubscription ? "∞" : hearts}
            </span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "rgba(251,191,36,0.12)", border: "1px solid rgba(251,191,36,0.3)" }}>
            <span className="text-base">⚡</span>
            <span className="font-extrabold text-sm" style={{ color: "#fcd34d" }}>
              {points.toLocaleString()}
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.3)" }}>
            <span className="text-base">🔥</span>
            <span className="font-extrabold text-sm" style={{ color: "#fdba74" }}>
              {currentStreak}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};