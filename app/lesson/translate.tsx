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
  // Novo: quiz passa estes dois para o componente registrar seu submit
  onResult: (isCorrect: boolean) => void;
  registerSubmit: (fn: () => void) => void;
};

export const Translate = ({
  challenge,
  onSelect,
  status,
  disabled,
  onResult,
  registerSubmit,
}: TranslateProps) => {
  const [input, setInput] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const normalizeText = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");

  const handleSubmit = () => {
    if (!correctOption || !input.trim() || status !== "none") return;
    const isCorrect = normalizeText(input) === normalizeText(correctOption.text);
    onResult(isCorrect);
  };

  // Registra o submit no ref do quiz assim que montar
  useEffect(() => {
    registerSubmit(handleSubmit);
  });

  // Habilita o botão Verificar assim que digitar algo
  useEffect(() => {
    if (input.trim().length > 0) {
      onSelect(999);
    } else {
      onSelect(-1);
    }
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  // Limpa ao mudar de desafio
  useEffect(() => {
    setInput("");
  }, [challenge.id]);

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <p className="text-2xl font-medium text-neutral-700">{challenge.question}</p>
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
        autoFocus
      />
    </div>
  );
};