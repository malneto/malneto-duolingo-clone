"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useKey } from "react-use";
import { MESSAGES } from "@/constants/messages";

type FooterProps = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
  correctAnswer?: string; // shown when wrong
};

export const Footer = ({ onCheck, status, disabled, lessonId, correctAnswer }: FooterProps) => {
  useKey("Enter", onCheck, {}, [onCheck]);

  const isCorrect   = status === "correct";
  const isWrong     = status === "wrong";
  const isCompleted = status === "completed";
  const isDone      = isCorrect || isCompleted;

  const footerBg     = isCorrect ? "rgba(74,222,128,0.08)" : isWrong ? "rgba(248,113,113,0.08)" : "rgba(10,14,26,0.95)";
  const footerBorder = isCorrect ? "rgba(74,222,128,0.4)"  : isWrong ? "rgba(248,113,113,0.4)"  : "rgba(99,102,241,0.25)";

  return (
    <footer className="fixed left-0 right-0 z-40 bottom-[60px] lg:bottom-0 transition-all duration-300"
      style={{ background: footerBg, borderTop: `2px solid ${footerBorder}`, backdropFilter: "blur(16px)" }}>
      <div className="mx-auto max-w-[1140px] px-4 py-3 lg:px-10 lg:py-4">

        {isCorrect && (
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: "rgba(74,222,128,0.2)", border: "1.5px solid rgba(74,222,128,0.5)" }}>
              <CheckCircle className="h-6 w-6" style={{ color: "#4ade80" }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#86efac" }}>Missão concluída! 🚀</p>
              <p className="text-base font-bold" style={{ color: "#4ade80" }}>{MESSAGES.wellDone}</p>
            </div>
          </div>
        )}

        {isWrong && (
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(248,113,113,0.2)", border: "1.5px solid rgba(248,113,113,0.5)" }}>
              <XCircle className="h-6 w-6" style={{ color: "#f87171" }} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#fca5a5" }}>Rota incorreta! 🛸</p>
              <p className="text-sm font-bold" style={{ color: "#f87171" }}>{MESSAGES.tryAgain}</p>
              {correctAnswer && (
                <p className="mt-1 text-sm text-slate-400">
                  Resposta correta: <span className="font-extrabold text-white">{correctAnswer}</span>
                </p>
              )}
            </div>
          </div>
        )}

        <button onClick={onCheck} disabled={disabled}
          className="w-full rounded-2xl py-4 text-lg font-extrabold tracking-wide transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30"
          style={isDone ? {
            background: "linear-gradient(135deg, #22d3ee, #0ea5e9)", color: "#0f172a",
            boxShadow: "0 0 20px rgba(34,211,238,0.4), 0 4px 0 rgba(14,165,233,0.6)",
          } : isWrong ? {
            background: "linear-gradient(135deg, #f87171, #ef4444)", color: "#fff",
            boxShadow: "0 0 20px rgba(248,113,113,0.3), 0 4px 0 rgba(220,38,38,0.5)",
          } : {
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff",
            boxShadow: "0 0 20px rgba(99,102,241,0.4), 0 4px 0 rgba(67,56,202,0.6)",
          }}>
          {status === "none" && "🛸 " + MESSAGES.verify}
          {(isDone || isWrong) && "🚀 " + MESSAGES.continue}
        </button>
      </div>
    </footer>
  );
};