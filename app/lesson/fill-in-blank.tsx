"use client";

import { useState, useEffect, useRef } from "react";

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

const SPACE_CHARACTERS = [
  {
    emoji: "👨‍🚀",
    name: "Astronauta",
    color: "#a5b4fc",
    glow: "rgba(165,180,252,0.3)",
    bg: "rgba(99,102,241,0.15)",
    border: "rgba(99,102,241,0.4)",
    speech: "rgba(99,102,241,0.2)",
  },
  {
    emoji: "👽",
    name: "ET",
    color: "#86efac",
    glow: "rgba(134,239,172,0.3)",
    bg: "rgba(74,222,128,0.15)",
    border: "rgba(74,222,128,0.4)",
    speech: "rgba(74,222,128,0.2)",
  },
  {
    emoji: "🤖",
    name: "Robô Cósmico",
    color: "#67e8f9",
    glow: "rgba(103,232,249,0.3)",
    bg: "rgba(34,211,238,0.15)",
    border: "rgba(34,211,238,0.4)",
    speech: "rgba(34,211,238,0.2)",
  },
  {
    emoji: "🦠",
    name: "Bactéria Cósmica",
    color: "#f9a8d4",
    glow: "rgba(249,168,212,0.3)",
    bg: "rgba(244,114,182,0.15)",
    border: "rgba(244,114,182,0.4)",
    speech: "rgba(244,114,182,0.2)",
  },
  {
    emoji: "🪐",
    name: "Ser Planetário",
    color: "#fdba74",
    glow: "rgba(253,186,116,0.3)",
    bg: "rgba(251,146,60,0.15)",
    border: "rgba(251,146,60,0.4)",
    speech: "rgba(251,146,60,0.2)",
  },
];

export const FillInBlank = ({
  challenge,
  onSelect,
  status,
  disabled,
  onResult,
  registerSubmit,
}: FillInBlankProps) => {
  const [input, setInput] = useState("");
  const submittedRef = useRef(false);

  // Pick a consistent character based on challenge id
  const char = SPACE_CHARACTERS[challenge.id % SPACE_CHARACTERS.length];

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const normalizeText = (text: string) =>
    text.toLowerCase().trim().replace(/\s+/g, " ");

  const handleSubmit = () => {
    if (!correctOption || !input.trim() || status !== "none" || submittedRef.current) return;
    submittedRef.current = true;
    const isCorrect = normalizeText(input) === normalizeText(correctOption.text);
    onResult(isCorrect);
  };

  useEffect(() => { registerSubmit(handleSubmit); });
  useEffect(() => {
    onSelect(input.trim().length > 0 ? 999 : -1);
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setInput(""); submittedRef.current = false; }, [challenge.id]);

  const inputBorderColor =
    status === "correct" ? "rgba(74,222,128,0.7)"
    : status === "wrong" ? "rgba(248,113,113,0.7)"
    : char.border;

  const inputGlow =
    status === "correct" ? "0 0 20px rgba(74,222,128,0.3)"
    : status === "wrong" ? "0 0 20px rgba(248,113,113,0.3)"
    : `0 0 16px ${char.glow}`;

  return (
    <div className="flex flex-col items-center gap-6 px-2">

      {/* Character with speech bubble */}
      <div className="flex w-full items-end gap-4">
        {/* Character */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full text-5xl transition-all duration-300"
            style={{
              background: char.bg,
              border: `2px solid ${char.border}`,
              boxShadow: `0 0 24px ${char.glow}`,
              filter: status === "correct" ? "brightness(1.2)" : status === "wrong" ? "brightness(0.8) saturate(0.5)" : "none",
            }}
          >
            {char.emoji}
          </div>
          <span className="text-xs font-bold" style={{ color: char.color }}>
            {char.name}
          </span>
        </div>

        {/* Speech bubble */}
        <div
          className="relative flex-1 rounded-2xl rounded-bl-none px-5 py-4"
          style={{
            background: char.speech,
            border: `1.5px solid ${char.border}`,
            boxShadow: `0 0 16px ${char.glow}`,
          }}
        >
          {/* Bubble tail */}
          <div
            className="absolute -left-3 bottom-4 h-3 w-3 rotate-45"
            style={{ background: char.speech, borderLeft: `1.5px solid ${char.border}`, borderBottom: `1.5px solid ${char.border}` }}
          />
          <p className="text-lg font-bold leading-snug text-white">
            {challenge.question}
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest" style={{ color: char.color }}>
            ✏️ Complete a frase
          </p>
        </div>
      </div>

      {/* Input */}
      <div
        className="w-full rounded-2xl p-0.5 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${inputBorderColor}, rgba(99,102,241,0.3))`,
          boxShadow: inputGlow,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
          placeholder="Digite a palavra que falta..."
          className="w-full rounded-2xl px-6 py-5 text-xl font-semibold text-white placeholder-slate-500 outline-none disabled:opacity-50"
          style={{ background: "rgba(10,14,26,0.9)", backdropFilter: "blur(8px)" }}
          disabled={disabled || status !== "none"}
          autoFocus
        />
      </div>

      {/* Status feedback */}
      {status === "correct" && (
        <p className="text-base font-extrabold" style={{ color: "#86efac" }}>
          ✅ {char.name} aprova! Perfeito!
        </p>
      )}
      {status === "wrong" && correctOption && (
        <div className="text-center">
          <p className="text-base font-extrabold" style={{ color: "#fca5a5" }}>❌ Não foi dessa vez!</p>
          <p className="mt-1 text-sm text-slate-400">
            Resposta: <span className="font-bold text-white">{correctOption.text}</span>
          </p>
        </div>
      )}
    </div>
  );
};