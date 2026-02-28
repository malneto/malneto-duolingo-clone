"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useKey, useMedia } from "react-use";
import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/constants/messages";

type FooterProps = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
}: FooterProps) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  const isCorrect = status === "correct";
  const isWrong = status === "wrong";
  const isCompleted = status === "completed";
  const isDone = isCorrect || isCompleted;

  return (
    <footer
      className={`
        fixed left-0 right-0 z-40 border-t-2 transition-all duration-300
        /* ─── CHAVE: bottom sobe 60px no mobile para ficar ACIMA do bottom-nav ─── */
        bottom-[60px] lg:bottom-0
        ${isCorrect ? "border-green-400 bg-green-50" : ""}
        ${isWrong ? "border-rose-400 bg-rose-50" : ""}
        ${!isCorrect && !isWrong ? "border-slate-200 bg-white" : ""}
      `}
    >
      <div className="mx-auto max-w-[1140px] px-4 py-3 lg:px-10 lg:py-5">

        {/* Feedback banner */}
        {isCorrect && (
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 shadow-md">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                Incrível! 🎉
              </p>
              <p className="text-base font-bold text-green-700">
                {MESSAGES.wellDone}
              </p>
            </div>
          </div>
        )}

        {isWrong && (
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 shadow-md">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-rose-500">
                Quase lá! 💪
              </p>
              <p className="text-base font-bold text-rose-600">
                {MESSAGES.tryAgain}
              </p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={onCheck}
          disabled={disabled}
          className={`
            w-full rounded-2xl py-4 text-lg font-extrabold tracking-wide shadow-md
            transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed
            ${isDone
              ? "bg-green-500 text-white shadow-green-200 hover:bg-green-600 hover:shadow-green-300"
              : isWrong
              ? "bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600"
              : "bg-[#58CC02] text-white shadow-[0_4px_0_#3d8f00] hover:bg-[#4db800] hover:shadow-[0_2px_0_#3d8f00] active:shadow-none active:translate-y-[2px]"
            }
          `}
        >
          {status === "none" && `✅ ${MESSAGES.verify}`}
          {(isDone || isWrong) && `➡️ ${MESSAGES.continue}`}
        </button>
      </div>
    </footer>
  );
};