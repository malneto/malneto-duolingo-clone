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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="mx-auto max-w-[1140px] px-4 py-3 flex items-center justify-between">
        
        {/* Corações */}
        <div className="flex items-center gap-1">
          <Image src="/heart.svg" alt="Hearts" width={28} height={28} />
          <span className="font-bold text-xl text-rose-500">
            {hasActiveSubscription ? "∞" : hearts}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1">
          <Image src="/points.svg" alt="XP" width={24} height={24} />
          <span className="font-bold text-xl text-amber-500">{points}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-xl text-orange-500">{currentStreak}</span>
        </div>

        {/* Maçã (Poder) */}
        <div className="flex items-center gap-1">
          <Image src="/apple.svg" alt="Apple Power" width={26} height={26} />
          <span className="font-bold text-xl text-red-500">0</span>
        </div>

      </div>
    </div>
  );
};