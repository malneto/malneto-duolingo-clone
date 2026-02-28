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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="mx-auto max-w-[1140px] px-4 py-2.5 flex items-center justify-between">
        {/* ÍCONE BANDEIRA CURSO - Left primeiro */}
        <Link href="/courses" className="mr-3">
          <Image 
            src="https://flagcdn.com/w320/us.png" 
            alt="Curso Inglês (US)" 
            height={32} 
            width={32}
            className="h-8 w-auto rounded-full" 
          />
        </Link>
        
        {/* Corações */}
        <div className="flex items-center gap-1">
          <Image src="/heart.svg" alt="Hearts" width={24} height={24} />
          <span className="font-bold text-lg text-rose-500">
            {hasActiveSubscription ? "∞" : hearts}
          </span>
        </div>

        {/* XP */}
        <div className="flex items-center gap-1">
          <Image src="/points.svg" alt="XP" width={22} height={22} />
          <span className="font-bold text-lg text-amber-500">{points}</span>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-1">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-lg text-orange-500">{currentStreak}</span>
        </div>
      </div>
    </div>
  );
};