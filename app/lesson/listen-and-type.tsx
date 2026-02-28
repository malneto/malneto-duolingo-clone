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

type ListenAndTypeProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  onResult: (isCorrect: boolean) => void;
  registerSubmit: (fn: () => void) => void;
};

export const ListenAndType = ({
  challenge,
  onSelect,
  status,
  disabled,
  onResult,
  registerSubmit,
}: ListenAndTypeProps) => {
  const [input, setInput] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const normalizeText = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");

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

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(challenge.question);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

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
      {/* Audio trigger button */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={playAudio}
          disabled={disabled || status !== "none"}
          className="group relative flex h-28 w-28 items-center justify-center rounded-full text-5xl transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
            border: "2px solid rgba(99,102,241,0.6)",
            boxShadow: "0 0 30px rgba(99,102,241,0.3), 0 0 60px rgba(99,102,241,0.1)",
          }}
        >
          {/* Orbit ring */}
          <div
            className="absolute rounded-full border border-cyan-400/30 animate-spin"
            style={{ inset: "-10px", animationDuration: "6s" }}
          />
          🔊
        </button>
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-300">
          Ouça e escreva o que ouviu
        </p>
      </div>

      {/* Input */}
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
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Type what you hear..."
          className="w-full rounded-2xl px-6 py-5 text-xl font-semibold text-white placeholder-slate-500 outline-none disabled:opacity-50"
          style={{ background: "rgba(10,14,26,0.9)", backdropFilter: "blur(8px)" }}
          disabled={disabled || status !== "none"}
          autoFocus
        />
      </div>
    </div>
  );
};