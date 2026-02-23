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

    // === DEBUG ===
    console.log("=== DEBUG LISTEN_AND_TYPE ===");
    console.log("Usuário digitou (original):", input);
    console.log("Usuário digitou (normalizado):", normalizedInput);
    console.log("Resposta correta no banco (original):", correctOption.text);
    console.log("Resposta correta no banco (normalizado):", normalizedCorrect);
    console.log("São iguais?", normalizedInput === normalizedCorrect);
    // =============

    const isCorrect = normalizedInput === normalizedCorrect;

    if (isCorrect) {
      onSelect(correctOption.id);
    } else {
      onSelect(-1);
    }
  };

  // Habilita o botão CHECK do Footer assim que digitar qualquer coisa
  useEffect(() => {
    if (input.trim()) {
      onSelect(999);
    } else {
      onSelect(-1);
    }
  }, [input, onSelect]);

  // Garante que o campo comece sempre vazio
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
      <div className="text-center">
        <p className="text-2xl font-medium text-neutral-700 mb-4">
          Listen and type what you hear
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={playAudio}
          disabled={disabled || status !== "none"}
          className="flex h-28 w-28 items-center justify-center rounded-full bg-green-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all disabled:bg-neutral-400"
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
      />
    </div>
  );
};