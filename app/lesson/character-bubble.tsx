"use client";

import { useEffect, useRef } from "react";

type CharacterBubbleProps = {
  question: string;
  seedId?: number;
  label?: string;
  autoSpeak?: boolean;
  showSpeakButton?: boolean;
  speakText?: string; // override what gets spoken (for ASSIST with blanks replaced)
};

const SPACE_CHARACTERS = [
  { emoji: "👨‍🚀", name: "Astronauta", color: "#a5b4fc", glow: "rgba(165,180,252,0.3)", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.4)", speech: "rgba(99,102,241,0.15)" },
  { emoji: "👽",   name: "ET",          color: "#86efac", glow: "rgba(134,239,172,0.3)", bg: "rgba(74,222,128,0.15)",  border: "rgba(74,222,128,0.4)",  speech: "rgba(74,222,128,0.12)"  },
  { emoji: "🤖",   name: "Robô",        color: "#67e8f9", glow: "rgba(103,232,249,0.3)", bg: "rgba(34,211,238,0.15)", border: "rgba(34,211,238,0.4)",  speech: "rgba(34,211,238,0.12)"  },
  { emoji: "🦠",   name: "Bactéria",    color: "#f9a8d4", glow: "rgba(249,168,212,0.3)", bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.4)", speech: "rgba(244,114,182,0.12)" },
  { emoji: "🪐",   name: "Planetário",  color: "#fdba74", glow: "rgba(253,186,116,0.3)", bg: "rgba(251,146,60,0.15)", border: "rgba(251,146,60,0.4)",   speech: "rgba(251,146,60,0.12)"  },
  { emoji: "🛸",   name: "OVNI",        color: "#c4b5fd", glow: "rgba(196,181,253,0.3)", bg: "rgba(167,139,250,0.15)", border: "rgba(167,139,250,0.4)", speech: "rgba(167,139,250,0.12)" },
];

export const speakEN = (text: string, rate = 0.85) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "en-US";
  utt.rate = rate;
  utt.pitch = 1;
  window.speechSynthesis.speak(utt);
};

export const CharacterBubble = ({
  question,
  seedId = 0,
  label,
  autoSpeak = false,
  showSpeakButton = false,
  speakText,
}: CharacterBubbleProps) => {
  const char = SPACE_CHARACTERS[seedId % SPACE_CHARACTERS.length];
  const textToSpeak = speakText ?? question;
  const hasSpokenRef = useRef(false);

  useEffect(() => { hasSpokenRef.current = false; }, [question]);

  useEffect(() => {
    if (!autoSpeak || hasSpokenRef.current) return;
    const t = setTimeout(() => {
      speakEN(textToSpeak);
      hasSpokenRef.current = true;
    }, 400);
    return () => { clearTimeout(t); window.speechSynthesis?.cancel(); };
  }, [autoSpeak, textToSpeak]);

  const handleSpeak = () => speakEN(textToSpeak);

  return (
    <div className="mb-4 flex items-end gap-4">
      {/* Character */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <div className="relative">
          <div className="absolute rounded-full border animate-spin"
            style={{ inset: "-5px", animationDuration: "8s", borderColor: char.border }} />
          <button
            onClick={showSpeakButton ? handleSpeak : undefined}
            className="relative flex h-16 w-16 items-center justify-center rounded-full text-4xl transition-all duration-200"
            style={{
              background: char.bg,
              border: `2px solid ${char.border}`,
              boxShadow: `0 0 20px ${char.glow}`,
              cursor: showSpeakButton ? "pointer" : "default",
            }}
            title={showSpeakButton ? "Ouvir pergunta" : undefined}
          >
            {char.emoji}
            {showSpeakButton && (
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-cyan-400 border-2 border-slate-900 animate-pulse" />
            )}
          </button>
        </div>
        <span className="text-xs font-bold" style={{ color: char.color }}>{char.name}</span>
      </div>

      {/* Speech bubble */}
      <div className="relative flex-1">
        <div
          className="relative rounded-2xl rounded-bl-none px-5 py-4"
          style={{ background: char.speech, border: `1.5px solid ${char.border}`, boxShadow: `0 0 16px ${char.glow}`, backdropFilter: "blur(8px)" }}
        >
          <div className="absolute -left-3 bottom-4 h-3 w-3 rotate-45"
            style={{ background: char.speech, borderLeft: `1.5px solid ${char.border}`, borderBottom: `1.5px solid ${char.border}` }} />
          <p className="text-lg font-bold text-white leading-snug">{question}</p>
          {label && <p className="mt-1 text-xs font-semibold uppercase tracking-widest" style={{ color: char.color }}>{label}</p>}
          {showSpeakButton && (
            <button onClick={handleSpeak}
              className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold transition border hover:opacity-80"
              style={{ background: `${char.border}22`, borderColor: char.border, color: char.color }}>
              🔊 ouvir
            </button>
          )}
        </div>
      </div>
    </div>
  );
};