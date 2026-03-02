"use client";
import { useState, useEffect, useRef } from "react";
type ChallengeOption = { id: number; text: string; correct: boolean; };
type Challenge = { id: number; type: string; question: string; challengeOptions: ChallengeOption[]; };
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
  { emoji: "👨‍🚀", name: "Astronauta", color: "#a5b4fc", glow: "rgba(165,180,252,0.3)", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)", speech: "rgba(99,102,241,0.2)" },
  { emoji: "👽",   name: "ET",          color: "#86efac", glow: "rgba(134,239,172,0.3)", bg: "rgba(74,222,128,0.15)",  border: "rgba(74,222,128,0.4)",  speech: "rgba(74,222,128,0.15)"  },
  { emoji: "🤖",   name: "Robô Cósmico",color: "#67e8f9", glow: "rgba(103,232,249,0.3)", bg: "rgba(34,211,238,0.15)", border: "rgba(34,211,238,0.4)",  speech: "rgba(34,211,238,0.15)"  },
  { emoji: "🦠",   name: "Bactéria",    color: "#f9a8d4", glow: "rgba(249,168,212,0.3)", bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.4)", speech: "rgba(244,114,182,0.15)" },
  { emoji: "🪐",   name: "Planetário",  color: "#fdba74", glow: "rgba(253,186,116,0.3)", bg: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.4)",   speech: "rgba(251,146,60,0.15)"  },
];
export const FillInBlank = ({ challenge, onSelect, status, disabled, onResult, registerSubmit }: FillInBlankProps) => {
  const [input, setInput] = useState("");
  const submittedRef = useRef(false);
  const errorCountRef = useRef(0);
  const char = SPACE_CHARACTERS[challenge.id % SPACE_CHARACTERS.length];
  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);
  const normalizeText = (t: string) => t.toLowerCase().trim().replace(/\s+/g, " ");
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
      if (errorCountRef.current >= 2 && correctOption) {
        setInput(correctOption.text);
      }
    }
  }, [status]); // eslint-disable-line
  const inputBorder = status === "correct" ? "rgba(74,222,128,0.7)" : status === "wrong" ? "rgba(248,113,113,0.7)" : char.border;
  const inputGlow = status === "correct" ? "0 0 20px rgba(74,222,128,0.3)" : status === "wrong" ? "0 0 20px rgba(248,113,113,0.3)" : `0 0 16px ${char.glow}`;
  const isPrefilled = errorCountRef.current >= 2 && status === "none" && input === correctOption?.text;
  return (
    <div className="flex flex-col gap-6 px-2">
      <div className="flex w-full items-end gap-4">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-full text-5xl"
            style={{ background: char.bg, border: `2px solid ${char.border}`, boxShadow: `0 0 24px ${char.glow}`,
              filter: status === "correct" ? "brightness(1.2)" : status === "wrong" ? "brightness(0.8) saturate(0.5)" : "none" }}>
            {char.emoji}
          </div>
          <span className="text-xs font-bold" style={{ color: char.color }}>{char.name}</span>
        </div>
        <div className="relative flex-1 rounded-2xl rounded-bl-none px-5 py-5"
          style={{ background: char.speech, border: `1.5px solid ${char.border}`, boxShadow: `0 0 16px ${char.glow}` }}>
          <div className="absolute -left-3 bottom-4 h-3 w-3 rotate-45"
            style={{ background: char.speech, borderLeft: `1.5px solid ${char.border}`, borderBottom: `1.5px solid ${char.border}` }} />
          <p className="text-xl font-bold leading-snug text-white">{challenge.question}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest" style={{ color: char.color }}>✏️ Complete a frase</p>
        </div>
      </div>
      {isPrefilled && (
        <p className="text-center text-xs font-bold uppercase tracking-widest" style={{ color: "#fbbf24" }}>
          💡 Resposta preenchida automaticamente — clique em Verificar
        </p>
      )}
      <div className="w-full rounded-2xl p-0.5 transition-all duration-300"
        style={{ background: `linear-gradient(135deg, ${inputBorder}, rgba(99,102,241,0.3))`, boxShadow: inputGlow }}>
        <input type="text" value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
          placeholder="Digite a palavra que falta..."
          className="w-full rounded-2xl px-6 py-5 text-xl font-semibold placeholder-slate-500 outline-none disabled:opacity-50"
          style={{ background: "rgba(10,14,26,0.9)", backdropFilter: "blur(8px)", color: isPrefilled ? "#fbbf24" : "#fff" }}
          disabled={disabled || status !== "none"} autoFocus />
      </div>
    </div>
  );
};
