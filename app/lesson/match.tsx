"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
  matchGroup: number | null;
};

type Challenge = {
  id: number;
  type: string;
  question: string;
  challengeOptions: ChallengeOption[];
};

type MatchProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

export const Match = ({ challenge, onSelect, status, disabled }: MatchProps) => {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [pairs, setPairs] = useState<Record<number, number>>({});

  const leftItems = challenge.challengeOptions.filter((opt) => !opt.correct);
  const rightItems = challenge.challengeOptions.filter((opt) => opt.correct);

  const handleLeftClick = (id: number) => {
    if (disabled || status !== "none") return;

    if (selectedLeft === id) {
      setSelectedLeft(null);
    } else if (!pairs[id]) {
      setSelectedLeft(id);
    }
  };

  const handleRightClick = (id: number) => {
    if (disabled || status !== "none" || selectedLeft === null) return;

    const existingLeft = Object.keys(pairs).find((key) => pairs[Number(key)] === id);

    if (existingLeft) {
      setPairs((prev) => {
        const newPairs = { ...prev };
        delete newPairs[Number(existingLeft)];
        return newPairs;
      });
      return;
    }

    setPairs((prev) => ({ ...prev, [selectedLeft]: id }));
    setSelectedLeft(null);

    // Se completou todos os pares, avalia automaticamente
    if (Object.keys({ ...pairs, [selectedLeft]: id }).length === leftItems.length) {
      const allCorrect = Object.entries({ ...pairs, [selectedLeft]: id }).every(
        ([leftId, rightId]) => {
          const leftOpt = challenge.challengeOptions.find((o) => o.id === Number(leftId));
          const rightOpt = challenge.challengeOptions.find((o) => o.id === rightId);
          return leftOpt && rightOpt && leftOpt.matchGroup === rightOpt.matchGroup;
        }
      );

      if (allCorrect) {
        onSelect(challenge.challengeOptions[0].id);
      } else {
        onSelect(-1);
      }
    }
  };

  return (
    <div className="space-y-8">
      <p className="text-center text-xl font-medium text-neutral-700">
        {challenge.question || "Match the pairs"}
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* Coluna Esquerda */}
        <div className="space-y-3">
          {leftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              disabled={disabled || status !== "none" || !!pairs[item.id]}
              className={cn(
                "w-full rounded-2xl border-2 px-6 py-4 text-left text-lg transition-all",
                selectedLeft === item.id && "border-green-500 bg-green-50",
                pairs[item.id] && "border-green-500 bg-green-50 opacity-75"
              )}
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* Coluna Direita */}
        <div className="space-y-3">
          {rightItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              disabled={disabled || status !== "none"}
              className={cn(
                "w-full rounded-2xl border-2 px-6 py-4 text-left text-lg transition-all",
                Object.values(pairs).includes(item.id) && "border-green-500 bg-green-50 opacity-75"
              )}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};