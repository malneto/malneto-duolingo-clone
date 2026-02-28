/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Mic, MicOff } from "lucide-react";

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

type SpeakProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

export const Speak = ({ challenge, onSelect, status, disabled }: SpeakProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const normalizeText = (text: string) =>
    text.toLowerCase().replace(/[^\w\s]/g, "").trim().replace(/\s+/g, " ");

  const startListening = () => {
    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert("Seu navegador não suporta reconhecimento de voz.\nUse Chrome ou Edge.");
      return;
    }
    const recog = new SpeechRecognitionAPI();
    recog.continuous = false;
    recog.interimResults = false;
    recog.lang = "en-US";
    recog.onresult = (event: any) => {
      const spokenText = event.results[0][0].transcript.trim();
      setTranscript(spokenText);
      if (correctOption) {
        onSelect(normalizeText(spokenText) === normalizeText(correctOption.text) ? correctOption.id : -1);
      }
      setIsListening(false);
    };
    recog.onerror = () => { setIsListening(false); alert("Não consegui ouvir. Tente novamente."); };
    recog.onend = () => setIsListening(false);
    recog.start();
    setIsListening(true);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-6">
      <div className="text-center">
        <p className="text-2xl font-bold text-white">{challenge.question}</p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-indigo-300">
          🎙️ Fale em voz alta
        </p>
      </div>

      {/* Mic button */}
      <div className="relative flex items-center justify-center">
        {/* Pulse rings when listening */}
        {isListening && (
          <>
            <div className="absolute h-40 w-40 animate-ping rounded-full opacity-20"
              style={{ background: "rgba(248,113,113,0.4)" }} />
            <div className="absolute h-36 w-36 animate-ping rounded-full opacity-30"
              style={{ background: "rgba(248,113,113,0.4)", animationDelay: "0.2s" }} />
          </>
        )}
        {/* Orbit ring */}
        <div
          className="absolute rounded-full border animate-spin"
          style={{
            inset: "-12px",
            animationDuration: "8s",
            borderColor: isListening ? "rgba(248,113,113,0.5)" : "rgba(99,102,241,0.4)",
          }}
        />
        <button
          onClick={isListening ? () => setIsListening(false) : startListening}
          disabled={disabled || status !== "none"}
          className="relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-40"
          style={{
            background: isListening
              ? "linear-gradient(135deg, rgba(239,68,68,0.4), rgba(220,38,38,0.4))"
              : "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))",
            border: `2px solid ${isListening ? "rgba(248,113,113,0.7)" : "rgba(99,102,241,0.6)"}`,
            boxShadow: isListening
              ? "0 0 40px rgba(248,113,113,0.4)"
              : "0 0 30px rgba(99,102,241,0.3)",
            backdropFilter: "blur(8px)",
          }}
        >
          {isListening
            ? <MicOff className="h-12 w-12" style={{ color: "#fca5a5" }} />
            : <Mic    className="h-12 w-12" style={{ color: "#a5b4fc" }} />}
        </button>
      </div>

      {/* Transcript */}
      {transcript && (
        <div
          className="w-full max-w-sm rounded-2xl px-6 py-4 text-center"
          style={{
            background: "rgba(15,23,42,0.8)",
            border: "1.5px solid rgba(99,102,241,0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-1">Você disse:</p>
          <p className="text-lg font-semibold text-white">&quot;{transcript}&quot;</p>
        </div>
      )}

      {status === "correct" && (
        <p className="text-lg font-extrabold" style={{ color: "#86efac" }}>✅ Perfeito, astronauta!</p>
      )}
      {status === "wrong" && (
        <p className="text-lg font-extrabold" style={{ color: "#fca5a5" }}>❌ Tente novamente</p>
      )}
    </div>
  );
};