import Image from "next/image";

type StreakProps = {
  currentStreak: number;
  longestStreak?: number;
};

export const Streak = ({ currentStreak, longestStreak = 0 }: StreakProps) => {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-orange-100">
      <div className="text-4xl">🔥</div>
      
      <div>
        <p className="font-bold text-2xl text-orange-500 leading-none">
          {currentStreak}
        </p>
        <p className="text-xs text-neutral-500 -mt-1">dias seguidos</p>
      </div>

      {longestStreak > 0 && (
        <div className="ml-4 pl-4 border-l border-neutral-200">
          <p className="text-xs text-neutral-400">Recorde</p>
          <p className="font-semibold text-sm text-neutral-600">
            {longestStreak} dias
          </p>
        </div>
      )}
    </div>
  );
};