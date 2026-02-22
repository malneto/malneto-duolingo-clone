"use client";

import { useState } from "react";

type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
};

type Challenge = {
  id: number;
  type: string;
  question: string;
  audio_url?: string | null;
  challengeOptions: ChallengeOption[];
};

type ListenAndTypeProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
};

export const ListenAndType = ({
  challenge,
  onSelect,
  status,
  selectedOption,
  disabled,
}: ListenAndTypeProps) => {
  const [input, setInput] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const playAudio = () => {
    if (challenge.audio_url) {
      const audio = new Audio(challenge.audio_url);
      audio.play();
    } else {
      alert("Áudio não configurado para este desafio.");
    }
  };

  const handleCheck = () => {
    if (!correctOption) return;

    const isCorrect = input.trim().toLowerCase() === correctOption.text.toLowerCase();

    if (isCorrect) {
      onSelect(correctOption.id);
    } else {
      onSelect(-1);
    }
  };

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <button
          onClick={playAudio}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500 text-white text-6xl hover:scale-110 active:scale-95 transition-all"
        >
          🔊
        </button>
        <p className="text-neutral-500 mt-4">Ouça e digite o que ouviu</p>
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        placeholder="Digite o que ouviu..."
        className="w-full rounded-2xl border-2 border-neutral-200 bg-white px-6 py-5 text-2xl focus:border-green-500 focus:outline-none"
        disabled={disabled || status !== "none"}
      />

      <button
        onClick={handleCheck}
        disabled={!input.trim() || disabled || status !== "none"}
        className="w-full rounded-2xl bg-green-500 py-4 text-xl font-bold text-white disabled:bg-neutral-300"
      >
        Verificar
      </button>
    </div>
  );
};