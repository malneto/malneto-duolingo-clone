"use client";

import { InfinityIcon, X } from "lucide-react";
import Image from "next/image";
import { useExitModal } from "@/store/use-exit-modal";

type HeaderProps = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
};

export const Header = ({
  hearts,
  percentage,
  hasActiveSubscription,
}: HeaderProps) => {
  const { open } = useExitModal();

  return (
    <header className="mx-auto flex w-full max-w-[1140px] items-center gap-x-4 px-4 pt-4 pb-2 lg:px-10 lg:pt-10 lg:pb-4">
      {/* Exit button */}
      <button
        onClick={open}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 active:scale-95"
      >
        <X className="h-5 w-5 stroke-[2.5]" />
      </button>

      {/* Progress bar — custom rounded pill */}
      <div className="relative flex-1 h-4 rounded-full bg-slate-100 overflow-hidden shadow-inner">
        {/* Glow track */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#58CC02] to-[#89E219] transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        {/* Shine overlay */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 60%)",
          }}
        />
        {/* Star emoji at the tip */}
        {percentage > 4 && (
          <span
            className="absolute top-1/2 -translate-y-1/2 text-xs leading-none transition-all duration-500"
            style={{ left: `calc(${percentage}% - 12px)` }}
          >
            ⭐
          </span>
        )}
      </div>

      {/* Hearts */}
      <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-rose-50 px-3 py-1.5 shadow-sm border border-rose-100">
        <Image
          src="/heart.svg"
          height={22}
          width={22}
          alt="Heart"
          className="drop-shadow-sm"
        />
        <span className="font-extrabold text-rose-500 text-sm">
          {hasActiveSubscription ? (
            <InfinityIcon className="h-4 w-4 shrink-0 stroke-[3]" />
          ) : (
            hearts
          )}
        </span>
      </div>
    </header>
  );
};