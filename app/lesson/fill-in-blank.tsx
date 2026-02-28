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
  onResult: (isCorrect: boolean) => void;
  registerSubmit: (fn: () => void) => void;
};

export const FillInBlank = ({
  challenge,
  onSelect,
  status,
  disabled,
  onResult,
  registerSubmit,
}: FillInBlankProps) => {
  const [input, setInput] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const normalizeText = (text: string) =>
    text.toLowerCase().trim().replace(/\s+/g, " ");

  const handleSubmit = () => {
    if (!correctOption || !input.trim() || status !== "none") return;
    const isCorrect = normalizeText(input) === normalizeText(correctOption.text);
    onResult(isCorrect);
  };

  useEffect(() => {
    registerSubmit(handleSubmit);
  });

  useEffect(() => {
    if (input.trim().length > 0) {
      onSelect(999);
    } else {
      onSelect(-1);
    }
  }, [input]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setInput("");
  }, [challenge.id]);

  return (
    <div className="space-y-8 px-4">
      <div className="text-center">
        <p className="text-2xl font-medium text-neutral-700">{challenge.question}</p>
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
        autoFocus
      />
    </div>
  );
};