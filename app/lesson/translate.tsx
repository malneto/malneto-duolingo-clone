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

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
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

  // Habilita o botão CHECK assim que digitar
  useEffect(() => {
    if (input.trim().length > 0) {
      onSelect(999);
    } else {
      onSelect(-1);
    }
  }, [input, onSelect]);

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
        <p className="text-neutral-500 mt-3">Type the translation in English</p>
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Type here..."
        className="w-full rounded-2xl border-2 border-neutral-200 bg-white px-6 py-5 text-2xl focus:border-green-500 focus:outline-none disabled:bg-neutral-100"
        disabled={disabled || status !== "none"}
      />
    </div>
  );
};