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

type FillInBlankProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
};

export const FillInBlank = ({
  challenge,
  onSelect,
  status,
  selectedOption,
  disabled,
}: FillInBlankProps) => {
  const [input, setInput] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  // Validação inteligente (ignora maiúsculas, espaços extras)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  };

  const handleSubmit = () => {
    if (!correctOption || !input.trim() || status !== "none") return;

    const normalizedInput = normalizeText(input);
    const normalizedCorrect = normalizeText(correctOption.text);

    const isCorrect = normalizedInput === normalizedCorrect;

    if (isCorrect) {
      onSelect(correctOption.id);
    } else {
      onSelect(-1);
    }
  };

  // Limpa o campo quando muda de desafio
  useEffect(() => {
    if (status === "none") {
      setInput("");
    }
  }, [status]);

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <p className="text-2xl font-medium text-neutral-700">
          {challenge.question}
        </p>
        <p className="text-neutral-500 mt-3">Complete a frase</p>
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Digite a palavra que falta..."
        className="w-full rounded-2xl border-2 border-neutral-200 bg-white px-6 py-5 text-2xl focus:border-green-500 focus:outline-none disabled:bg-neutral-100"
        disabled={disabled || status !== "none"}
      />
    </div>
  );
};