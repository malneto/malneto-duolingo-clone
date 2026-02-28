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

type ListenAndTypeProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  onResult: (isCorrect: boolean) => void;
  registerSubmit: (fn: () => void) => void;
};

export const ListenAndType = ({
  challenge,
  onSelect,
  status,
  disabled,
  onResult,
  registerSubmit,
}: ListenAndTypeProps) => {
  const [input, setInput] = useState("");

  const correctOption = challenge.challengeOptions.find((opt) => opt.correct);

  const normalizeText = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");

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

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(challenge.question);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 px-4">
      <div className="flex justify-center">
        <button
          onClick={playAudio}
          disabled={disabled || status !== "none"}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-green-500 text-7xl shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:bg-neutral-400"
        >
          🔊
        </button>
      </div>

      <div className="text-center text-neutral-500 text-sm">
        Ouça e digite o que ouviu
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="Type what you hear..."
        className="w-full rounded-2xl border-2 border-neutral-200 bg-white px-6 py-5 text-2xl focus:border-green-500 focus:outline-none disabled:bg-neutral-100"
        disabled={disabled || status !== "none"}
        autoFocus
      />
    </div>
  );
};