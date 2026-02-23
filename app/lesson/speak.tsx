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

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim()
      .replace(/\s+/g, " ");
  };

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
        const normalizedSpoken = normalizeText(spokenText);
        const normalizedCorrect = normalizeText(correctOption.text);

        if (normalizedSpoken === normalizedCorrect) {
          onSelect(correctOption.id);
        } else {
          onSelect(-1);
        }
      }
      setIsListening(false);
    };

    recog.onerror = () => {
      setIsListening(false);
      alert("Não consegui ouvir claramente. Tente novamente.");
    };

    recog.onend = () => setIsListening(false);

    recog.start();
    setIsListening(true);
  };

  return (
    <div className="flex flex-col items-center space-y-8 py-8">
      <div className="text-center">
        <p className="text-2xl font-medium text-neutral-700 mb-2">
          {challenge.question}
        </p>
        <p className="text-neutral-500">Fale em voz alta</p>
      </div>

      <button
        onClick={isListening ? () => setIsListening(false) : startListening}
        disabled={disabled || status !== "none"}
        className={`flex h-32 w-32 items-center justify-center rounded-full transition-all ${
          isListening
            ? "bg-red-500 animate-pulse"
            : "bg-green-500 hover:scale-110 active:scale-95"
        }`}
      >
        {isListening ? (
          <MicOff className="h-16 w-16 text-white" />
        ) : (
          <Mic className="h-16 w-16 text-white" />
        )}
      </button>

      {transcript && (
        <div className="text-center">
          <p className="text-sm text-neutral-500">Você disse:</p>
          <p className="text-xl font-medium mt-1">&quot;{transcript}&quot;</p>
        </div>
      )}

      {status === "correct" && <div className="text-green-600 font-bold text-xl">✅ Perfeito!</div>}
      {status === "wrong" && <div className="text-red-600 font-bold text-xl">❌ Tente novamente</div>}
    </div>
  );
};