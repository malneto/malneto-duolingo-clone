import { InfinityIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/db/schema";

type UserProgressProps = {
  activeCourse: typeof courses.$inferSelect;
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const UserProgress = ({
  activeCourse,
  hearts,
  points,
  hasActiveSubscription,
}: UserProgressProps) => {
  return (
    <div
      className="flex w-full items-center justify-between gap-x-2 rounded-2xl px-4 py-3"
      style={{
        background: "rgba(15,23,42,0.7)",
        border: "1.5px solid rgba(99,102,241,0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Active course flag */}
      <Link href="/courses">
        <div
          className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-xl transition-all hover:scale-110 active:scale-95"
          style={{
            border: "1.5px solid rgba(99,102,241,0.4)",
            boxShadow: "0 0 8px rgba(99,102,241,0.25)",
          }}
        >
          <Image
            src={activeCourse.imageSrc}
            alt={activeCourse.title}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      {/* XP */}
      <Link href="/shop">
        <div
          className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 transition-all hover:scale-105 active:scale-95"
          style={{
            background: "rgba(251,191,36,0.1)",
            border: "1px solid rgba(251,191,36,0.3)",
          }}
        >
          <Image src="/points.svg" height={20} width={20} alt="Points" />
          <span className="text-sm font-extrabold" style={{ color: "#fcd34d" }}>
            {points}
          </span>
        </div>
      </Link>

      {/* Hearts */}
      <Link href="/shop">
        <div
          className="flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 transition-all hover:scale-105 active:scale-95"
          style={{
            background: "rgba(248,113,113,0.1)",
            border: "1px solid rgba(248,113,113,0.3)",
          }}
        >
          <Image src="/heart.svg" height={20} width={20} alt="Hearts" />
          <span className="text-sm font-extrabold" style={{ color: "#fca5a5" }}>
            {hasActiveSubscription ? <InfinityIcon className="h-4 w-4 stroke-[3]" /> : hearts}
          </span>
        </div>
      </Link>
    </div>
  );
};