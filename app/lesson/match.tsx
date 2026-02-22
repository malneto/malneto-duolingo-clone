"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
  imageSrc?: string | null;
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

  const leftItems = challenge.challengeOptions.filter((_, i) => i % 2 === 0);
  const rightItems = challenge.challengeOptions.filter((_, i) => i % 2 === 1);

  const handleSelect = (id: number, side: "left" | "right") => {
    if (disabled || status !== "none") return;

    if (side === "left") {
      setSelectedLeft(id);
    } else if (selectedLeft !== null) {
      setPairs((prev) => ({ ...prev, [selectedLeft]: id }));
      setSelectedLeft(null);

      // Verifica se completou todos os pares
      if (Object.keys({ ...pairs, [selectedLeft]: id }).length === leftItems.length) {
        const allCorrect = Object.entries({ ...pairs, [selectedLeft]: id }).every(
          ([leftId, rightId]) => {
            const leftOpt = challenge.challengeOptions.find((o) => o.id === Number(leftId));
            const rightOpt = challenge.challengeOptions.find((o) => o.id === rightId);
            return leftOpt && rightOpt && leftOpt.correct === rightOpt.correct;
          }
        );

        if (allCorrect) {
          onSelect(challenge.challengeOptions[0].id); // qualquer id correto
        } else {
          onSelect(-1);
        }
      }
    }
  };

  return (
    <div className="space-y-8">
      <p className="text-center text-xl font-medium text-neutral-700">
        {challenge.question || "Relacione as colunas"}
      </p>

      <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
        {/* Coluna esquerda */}
        <div className="space-y-3">
          {leftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id, "left")}
              disabled={disabled || status !== "none" || !!pairs[item.id]}
              className={cn(
                "w-full rounded-2xl border-2 px-6 py-4 text-left text-lg transition-all",
                selectedLeft === item.id
                  ? "border-green-500 bg-green-50"
                  : pairs[item.id]
                  ? "border-green-500 bg-green-50"
                  : "border-neutral-200 hover:border-neutral-400"
              )}
            >
              {item.text}
            </button>
          ))}
        </div>

        {/* Coluna direita */}
        <div className="space-y-3">
          {rightItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id, "right")}
              disabled={disabled || status !== "none"}
              className={cn(
                "w-full rounded-2xl border-2 px-6 py-4 text-left text-lg transition-all",
                Object.values(pairs).includes(item.id)
                  ? "border-green-500 bg-green-50"
                  : "border-neutral-200 hover:border-neutral-400"
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