"use client";

import { InfinityIcon, X } from "lucide-react";
import Image from "next/image";
import { useExitModal } from "@/store/use-exit-modal";

type HeaderProps = {
  hearts: number;
  percentage: number;
  hasActiveSubscription: boolean;
};

export const Header = ({ hearts, percentage, hasActiveSubscription }: HeaderProps) => {
  const { open } = useExitModal();

  return (
    <header
      className="mx-auto flex w-full max-w-[1140px] items-center gap-x-4 px-4 pt-4 pb-3 lg:px-10 lg:pt-8"
    >
      {/* Exit */}
      <button
        onClick={open}
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition active:scale-95"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#94a3b8" }}
      >
        <X className="h-5 w-5 stroke-[2.5]" />
      </button>

      {/* Progress bar */}
      <div className="relative flex-1 h-4 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
        {/* Fill */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #0ea5e9, #22d3ee, #67e8f9)",
            boxShadow: "0 0 12px rgba(34,211,238,0.6)",
          }}
        />
        {/* Shine */}
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, background: "linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 60%)" }}
        />
        {/* Rocket tip */}
        {percentage > 3 && (
          <span
            className="absolute top-1/2 -translate-y-1/2 text-xs leading-none transition-all duration-500"
            style={{ left: `calc(${percentage}% - 14px)` }}
          >
            🚀
          </span>
        )}
      </div>

      {/* Hearts */}
      <div className="flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{ background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)" }}>
        <Image src="/heart.svg" height={20} width={20} alt="Heart" />
        <span className="font-extrabold text-sm" style={{ color: "#fca5a5" }}>
          {hasActiveSubscription ? <InfinityIcon className="h-4 w-4 stroke-[3]" /> : hearts}
        </span>
      </div>
    </header>
  );
};