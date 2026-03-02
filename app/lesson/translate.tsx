"use client";
import { useState, useEffect, useRef } from "react";
type ChallengeOption = { id: number; text: string; correct: boolean; };
type Challenge = { id: number; type: string; question: string; challengeOptions: ChallengeOption[]; };
type TranslateProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  onResult: (isCorrect: boolean) => void;
  registerSubmit: (fn: () => void) => void;
};
export const Translate = ({ challenge, onSelect, status, disabled, onResult, registerSubmit }: TranslateProps) => {
  const [input, setInput] = useState("");
  const submittedRef = useRef(false);
  const errorCountRef = useRef(0);
  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);
  const normalizeText = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
  const handleSubmit = () => {
    if (!correctOption || !input.trim() || status !== "none" || submittedRef.current) return;
    submittedRef.current = true;
    const isCorrect = normalizeText(input) === normalizeText(correctOption.text);
    if (!isCorrect) errorCountRef.current += 1;
    onResult(isCorrect);
  };
  useEffect(() => { registerSubmit(handleSubmit); });
  useEffect(() => { onSelect(input.trim().length > 0 ? 999 : -1); }, [input]); // eslint-disable-line
  useEffect(() => { setInput(""); submittedRef.current = false; errorCountRef.current = 0; }, [challenge.id]);
  useEffect(() => {
    if (status === "none") {
      submittedRef.current = false;
      // On second+ error, prefill with correct answer
      if (errorCountRef.current >= 2 && correctOption) {
        setInput(correctOption.text);
      }
    }
  }, [status]); // eslint-disable-line
  const borderColor = status === "correct" ? "rgba(74,222,128,0.7)" : status === "wrong" ? "rgba(248,113,113,0.7)" : "rgba(99,102,241,0.4)";
  const glowColor = status === "correct" ? "0 0 20px rgba(74,222,128,0.3)" : status === "wrong" ? "0 0 20px rgba(248,113,113,0.3)" : "none";
  const isPrefilled = errorCountRef.current >= 2 && status === "none" && input === correctOption?.text;
  return (
    <div className="space-y-6 px-2">
      {isPrefilled && (
        <p className="text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#fbbf24" }}>
          💡 Resposta preenchida automaticamente — clique em Verificar
        </p>
      )}
      <div
        className="w-full rounded-2xl p-0.5 transition-all duration-300"
        style={{ background: `linear-gradient(135deg, ${borderColor}, rgba(99,102,241,0.3))`, boxShadow: glowColor }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
          placeholder="Type the translation in English..."
          className="w-full rounded-2xl px-6 py-5 text-xl font-semibold text-white placeholder-slate-500 outline-none disabled:opacity-50"
          style={{ background: "rgba(10,14,26,0.9)", backdropFilter: "blur(8px)", color: isPrefilled ? "#fbbf24" : "#fff" }}
          disabled={disabled || status !== "none"}
          autoFocus
        />
      </div>
    </div>
  );
};
