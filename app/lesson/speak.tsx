/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

type ChallengeOption = { id: number; text: string; correct: boolean; };
type Challenge = { id: number; type: string; question: string; challengeOptions: ChallengeOption[]; };
type SpeakProps = { challenge: Challenge; onSelect: (id: number) => void; status: "correct" | "wrong" | "none"; disabled?: boolean; };

const SPACE_CHARACTERS = [
  { emoji: "👨‍🚀", name: "Astronauta", color: "#a5b4fc", glow: "rgba(165,180,252,0.3)", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)", speech: "rgba(99,102,241,0.2)" },
  { emoji: "👽",   name: "ET",          color: "#86efac", glow: "rgba(134,239,172,0.3)", bg: "rgba(74,222,128,0.15)",  border: "rgba(74,222,128,0.4)",  speech: "rgba(74,222,128,0.15)"  },
  { emoji: "🤖",   name: "Robô Cósmico",color: "#67e8f9", glow: "rgba(103,232,249,0.3)", bg: "rgba(34,211,238,0.15)", border: "rgba(34,211,238,0.4)",  speech: "rgba(34,211,238,0.15)"  },
  { emoji: "🦠",   name: "Bactéria",    color: "#f9a8d4", glow: "rgba(249,168,212,0.3)", bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.4)", speech: "rgba(244,114,182,0.15)" },
  { emoji: "🪐",   name: "Planetário",  color: "#fdba74", glow: "rgba(253,186,116,0.3)", bg: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.4)",   speech: "rgba(251,146,60,0.15)"  },
];

export const Speak = ({ challenge, onSelect, status, disabled }: SpeakProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const char = SPACE_CHARACTERS[challenge.id % SPACE_CHARACTERS.length];
  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const normalizeText = (text: string) =>
    text.toLowerCase().replace(/[^\w\s]/g, "").trim().replace(/\s+/g, " ");

  const startListening = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { alert("Seu navegador não suporta reconhecimento de voz.\nUse Chrome ou Edge."); return; }
    const recog = new SpeechRecognitionAPI();
    recog.continuous = false; recog.interimResults = false; recog.lang = "en-US";
    recog.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript.trim();
      setTranscript(spokenText);
      if (correctOption) onSelect(normalizeText(spokenText) === normalizeText(correctOption.text) ? correctOption.id : -1);
      setIsListening(false);
    };
    recog.onerror = () => { setIsListening(false); alert("Não consegui ouvir. Tente novamente."); };
    recog.onend = () => setIsListening(false);
    recog.start(); setIsListening(true);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Character + speech bubble — same pattern as FillInBlank */}
      <div className="flex w-full items-end gap-4">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="flex h-20 w-20 items-center justify-center rounded-full text-5xl"
            style={{ background: char.bg, border: `2px solid ${char.border}`, boxShadow: `0 0 24px ${char.glow}` }}>
            {char.emoji}
          </div>
          <span className="text-xs font-bold" style={{ color: char.color }}>{char.name}</span>
        </div>
        <div className="relative flex-1 rounded-2xl rounded-bl-none px-5 py-5"
          style={{ background: char.speech, border: `1.5px solid ${char.border}`, boxShadow: `0 0 16px ${char.glow}` }}>
          <div className="absolute -left-3 bottom-4 h-3 w-3 rotate-45"
            style={{ background: char.speech, borderLeft: `1.5px solid ${char.border}`, borderBottom: `1.5px solid ${char.border}` }} />
          <p className="text-xl font-bold leading-snug text-white">{challenge.question}</p>
          {correctOption && (
            <div className="mt-3 rounded-xl px-4 py-2"
              style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: char.color }}>Diga em inglês:</p>
              <p className="text-lg font-extrabold text-white">{correctOption.text}</p>
            </div>
          )}
        </div>
      </div>

      {/* Mic button */}
      <div className="relative flex items-center justify-center py-4">
        {isListening && (
          <>
            <div className="absolute h-40 w-40 animate-ping rounded-full opacity-20" style={{ background: "rgba(248,113,113,0.4)" }} />
            <div className="absolute h-36 w-36 animate-ping rounded-full opacity-30" style={{ background: "rgba(248,113,113,0.4)", animationDelay: "0.2s" }} />
          </>
        )}
        <div className="absolute rounded-full border animate-spin"
          style={{ inset: "-12px", animationDuration: "8s", borderColor: isListening ? "rgba(248,113,113,0.5)" : "rgba(99,102,241,0.4)" }} />
        <button onClick={isListening ? () => setIsListening(false) : startListening}
          disabled={disabled || status !== "none"}
          className="relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40"
          style={{
            background: isListening ? "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(220,38,38,0.4))" : "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
            border: `2px solid ${isListening ? "rgba(248,113,113,0.7)" : "rgba(99,102,241,0.6)"}`,
            boxShadow: isListening ? "0 0 40px rgba(248,113,113,0.4)" : "0 0 30px rgba(99,102,241,0.3)",
            backdropFilter: "blur(8px)",
          }}>
          {isListening ? <MicOff className="h-12 w-12" style={{ color: "#fca5a5" }} /> : <Mic className="h-12 w-12" style={{ color: "#a5b4fc" }} />}
        </button>
      </div>

      {transcript && (
        <div className="w-full max-w-sm rounded-2xl px-6 py-4 text-center"
          style={{ background: "rgba(15,23,42,0.8)", border: "1.5px solid rgba(99,102,241,0.4)", backdropFilter: "blur(8px)" }}>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">Você disse:</p>
          <p className="text-lg font-semibold text-white">&quot;{transcript}&quot;</p>
        </div>
      )}

      {status === "correct" && <p className="text-lg font-extrabold" style={{ color: "#86efac" }}>✅ Perfeito, astronauta!</p>}
      {status === "wrong"   && <p className="text-lg font-extrabold" style={{ color: "#fca5a5" }}>❌ Tente novamente</p>}
    </div>
  );
};