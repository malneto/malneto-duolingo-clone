"use client";

import { useEffect, useRef } from "react";

type QuestionBubbleProps = {
  question: string;
  autoPlayAudio?: boolean;
};

const SPACE_CHARS = ["🧑‍🚀", "👽", "🤖", "🛸"];

export const QuestionBubble = ({ question, autoPlayAudio = false }: QuestionBubbleProps) => {
  const charIndex = Math.abs(question.charCodeAt(0) + question.length) % SPACE_CHARS.length;
  const character = SPACE_CHARS[charIndex];
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    hasSpokenRef.current = false;
  }, [question]);

  useEffect(() => {
    if (!autoPlayAudio || hasSpokenRef.current) return;

    const text = question
      .replace(/Escute e escolha:?\s*/i, "")
      .replace(/Escute:?\s*/i, "")
      .trim();

    if (!text) return;

    const timer = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      hasSpokenRef.current = true;
    }, 400);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, [question, autoPlayAudio]);

  const handleSpeak = () => {
    const text = question
      .replace(/Escute e escolha:?\s*/i, "")
      .replace(/Escute:?\s*/i, "")
      .trim();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="mb-6 flex items-end gap-x-4">
      {/* Space character */}
      <div className="relative flex-shrink-0">
        <div
          className="absolute rounded-full border border-cyan-400/50 animate-spin"
          style={{ inset: "-6px", animationDuration: "8s" }}
        />
        <button
          onClick={autoPlayAudio ? handleSpeak : undefined}
          className={[
            "relative flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center",
            "rounded-full text-3xl lg:text-4xl select-none",
            "bg-gradient-to-br from-indigo-900 to-slate-900",
            "border-2 border-cyan-400/60 shadow-lg shadow-cyan-500/20",
            "transition-all duration-200",
            autoPlayAudio ? "hover:scale-110 active:scale-95 cursor-pointer" : "cursor-default",
          ].join(" ")}
          title={autoPlayAudio ? "Ouvir novamente" : undefined}
        >
          {character}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-cyan-400 border-2 border-slate-900 animate-pulse" />
        </button>
      </div>

      {/* Speech bubble */}
      <div className="relative flex-1 max-w-sm">
        <div
          className="rounded-2xl rounded-bl-sm px-4 py-3 text-sm lg:text-base font-medium text-white"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(15,23,42,0.85))",
            border: "1.5px solid rgba(99,102,241,0.5)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 20px rgba(99,102,241,0.15)",
          }}
        >
          {question}
          {autoPlayAudio && (
            <button
              onClick={handleSpeak}
              className="ml-2 inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-300 hover:bg-cyan-500/40 transition border border-cyan-500/30"
            >
              🔊 ouvir
            </button>
          )}
        </div>
        {/* Tail */}
        <div
          className="absolute -left-2.5 bottom-3 h-0 w-0"
          style={{
            borderRight: "10px solid rgba(99,102,241,0.5)",
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
          }}
        />
      </div>
    </div>
  );
};