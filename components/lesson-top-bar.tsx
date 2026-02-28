import Link from "next/link";
import Image from "next/image";

type LessonTopBarProps = {
  hearts: number;
  points: number;
  currentStreak: number;
  hasActiveSubscription: boolean;
};

export const LessonTopBar = ({
  hearts,
  points,
  currentStreak,
  hasActiveSubscription,
}: LessonTopBarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="mx-auto max-w-[1140px] px-4 py-2 flex items-center justify-between gap-2">

        {/* Course flag */}
        <Link href="/courses" className="flex-shrink-0">
          <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm transition hover:scale-110 active:scale-95">
            <Image
              src="https://flagcdn.com/w320/us.png"
              alt="Inglês"
              height={36}
              width={36}
              className="h-full w-full object-cover"
            />
          </div>
        </Link>

        {/* Stats pills */}
        <div className="flex items-center gap-2">
          {/* Hearts */}
          <div className="flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-100 px-3 py-1.5 shadow-sm">
            <span className="text-lg">❤️</span>
            <span className="font-extrabold text-sm text-rose-500">
              {hasActiveSubscription ? "∞" : hearts}
            </span>
          </div>

          {/* XP */}
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-100 px-3 py-1.5 shadow-sm">
            <span className="text-lg">⚡</span>
            <span className="font-extrabold text-sm text-amber-500">
              {points.toLocaleString()}
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-100 px-3 py-1.5 shadow-sm">
            <span className="text-lg">🔥</span>
            <span className="font-extrabold text-sm text-orange-500">
              {currentStreak}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};