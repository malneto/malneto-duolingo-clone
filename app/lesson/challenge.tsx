import { challengeOptions, challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Card } from "./card";

type ChallengeProps = {
  options: (typeof challengeOptions.$inferSelect)[];
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  selectedOption?: number;
  disabled?: boolean;
  type: string;
};

// Cores vibrantes para cada opção — estilo Duolingo kids
const CARD_COLORS = [
  "border-[#58CC02] bg-[#f0fce8] hover:bg-[#e4fad0] text-[#2d7a00]",  // verde
  "border-[#1CB0F6] bg-[#e8f8ff] hover:bg-[#d0f0ff] text-[#0077b6]",  // azul
  "border-[#FF9600] bg-[#fff8e8] hover:bg-[#fff0d0] text-[#b36a00]",  // laranja
  "border-[#FF4B4B] bg-[#fff0f0] hover:bg-[#ffe0e0] text-[#b30000]",  // vermelho
];

export const Challenge = ({
  options,
  onSelect,
  status,
  selectedOption,
  disabled,
  type,
}: ChallengeProps) => {
  return (
    <div
      className={cn(
        "grid gap-3",
        type === "ASSIST" && "grid-cols-1",
        type === "SELECT" && "grid-cols-2"
      )}
    >
      {options.map((option, i) => {
        const isSelected = selectedOption === option.id;
        const colorClass = CARD_COLORS[i % CARD_COLORS.length];

        return (
          <button
            key={option.id}
            onClick={() => !disabled && onSelect(option.id)}
            disabled={disabled}
            className={cn(
              // Base
              "relative flex items-center justify-between rounded-2xl border-2 border-b-4 px-4 py-3 text-left font-bold transition-all duration-150",
              "active:border-b-2 active:translate-y-[2px]",
              // Color per option
              !isSelected && status === "none" && colorClass,
              // Selected + status
              isSelected && status === "none" && "border-[#58CC02] bg-[#e4fad0] text-[#2d7a00] ring-2 ring-[#58CC02]/40 scale-[1.02]",
              isSelected && status === "correct" && "border-green-500 bg-green-100 text-green-700 ring-2 ring-green-400/50",
              isSelected && status === "wrong" && "border-rose-500 bg-rose-100 text-rose-700 ring-2 ring-rose-400/50",
              // Unselected after answer
              !isSelected && status !== "none" && "opacity-50 saturate-50",
              // Disabled
              disabled && "cursor-not-allowed",
            )}
          >
            {/* Number badge */}
            <div
              className={cn(
                "mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold",
                isSelected && status === "correct" && "border-green-500 bg-green-500 text-white",
                isSelected && status === "wrong" && "border-rose-500 bg-rose-500 text-white",
                isSelected && status === "none" && "border-[#58CC02] bg-[#58CC02] text-white",
                !isSelected && "border-current bg-white/60",
              )}
            >
              {i + 1}
            </div>

            <span className="flex-1 text-sm lg:text-base">{option.text}</span>

            {/* Result icon */}
            {isSelected && status === "correct" && (
              <span className="ml-2 text-xl">✅</span>
            )}
            {isSelected && status === "wrong" && (
              <span className="ml-2 text-xl">❌</span>
            )}
          </button>
        );
      })}
    </div>
  );
};