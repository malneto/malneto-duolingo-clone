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
  challengeOptions: ChallengeOption[];
};

type TranslateProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
};

export const Translate = ({
  challenge,
  onSelect,
  status,
  selectedOption,
  disabled,
}: TranslateProps) => {
  const [input, setInput] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const handleCheck = () => {
    if (!correctOption) return;

    const isCorrect = input.trim().toLowerCase() === correctOption.text.toLowerCase();

    if (isCorrect) {
      onSelect(correctOption.id);
    } else {
      onSelect(-1); // força status "wrong"
    }
  };

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <p className="text-2xl font-medium text-neutral-700">
          {challenge.question}
        </p>
        <p className="text-neutral-500 mt-3">Digite a tradução em inglês</p>
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        placeholder="Digite aqui..."
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