"use client";

import { useState, useEffect } from "react";

type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
};

type Challenge = {
  id: number;
  type: string;
  question: string;
  challengeOptions: ChallengeOption[];
};

type FillInBlankProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  onResult: (isCorrect: boolean) => void;
  registerSubmit: (fn: () => void) => void;
};

export const FillInBlank = ({
  challenge,
  onSelect,
  status,
  disabled,
  onResult,
  registerSubmit,
}: FillInBlankProps) => {
  const [input, setInput] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const normalizeText = (text: string) =>
    text.toLowerCase().trim().replace(/\s+/g, " ");

  const handleSubmit = () => {
    if (!correctOption || !input.trim() || status !== "none") return;
    const isCorrect = normalizeText(input) === normalizeText(correctOption.text);
    onResult(isCorrect);
  };

  useEffect(() => { registerSubmit(handleSubmit); });
  useEffect(() => {
    onSelect(input.trim().length > 0 ? 999 : -1);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setInput(""); }, [challenge.id]);

  const borderColor =
    status === "correct" ? "rgba(74,222,128,0.7)"
    : status === "wrong" ? "rgba(248,113,113,0.7)"
    : "rgba(99,102,241,0.4)";

  const glowColor =
    status === "correct" ? "0 0 20px rgba(74,222,128,0.3)"
    : status === "wrong" ? "0 0 20px rgba(248,113,113,0.3)"
    : "0 0 0px transparent";

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <p className="text-2xl font-bold text-white">{challenge.question}</p>
        <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-indigo-300">
          ✏️ Complete a frase
        </p>
      </div>

      <div
        className="rounded-2xl p-0.5 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${borderColor}, rgba(99,102,241,0.3))`,
          boxShadow: glowColor,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }}}
          placeholder="Digite a palavra que falta..."
          className="w-full rounded-2xl px-6 py-5 text-xl font-semibold text-white placeholder-slate-500 outline-none disabled:opacity-50"
          style={{ background: "rgba(10,14,26,0.9)", backdropFilter: "blur(8px)" }}
          disabled={disabled || status !== "none"}
          autoFocus
        />
      </div>
    </div>
  );
};