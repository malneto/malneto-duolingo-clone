"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import "react-circular-progressbar/dist/styles.css";

type LessonButtonProps = {
  id: number;
  index: number;
  totalCount: number;
  locked?: boolean;
  current?: boolean;
  percentage: number;
  subject?: string;
};

export const LessonButton = ({
  id,
  index,
  totalCount,
  locked,
  current,
  percentage,
  subject = "DEFAULT",
}: LessonButtonProps) => {
  const cycleLength = 8;
  const cycleIndex = index % cycleLength;

  let indentationLevel;
  if (cycleIndex <= 2) indentationLevel = cycleIndex;
  else if (cycleIndex <= 4) indentationLevel = 4 - cycleIndex;
  else if (cycleIndex <= 6) indentationLevel = 4 - cycleIndex;
  else indentationLevel = cycleIndex - 8;

  const rightPosition = indentationLevel * 40;

  const isFirst = index === 0;
  const isLast = index === totalCount;
  const isCompleted = !current && !locked;

  // Mapeamento de ícones por assunto
  const subjectIcons: Record<string, string> = {
    'ROBOTICS': '🤖',
    'MATH': '🔢',
    'SCIENCE': '🧪',
    'ENGLISH': '🇺🇸',
    'PORTUGUESE': '🇧🇷',
    'ASTRONOMY': '🌌',
    'FINANCE INFLUENCE': '💰',
    'DEFAULT': '⭐',
  };

  const icon = subjectIcons[subject] || subjectIcons.DEFAULT;

  const href = isCompleted || current ? `/lesson/${id}` : "#";

  return (
    <Link
      href={href}
      aria-disabled={locked && !current}
      style={{ pointerEvents: locked && !current ? "none" : "auto" }}
    >
      <div
        className="relative"
        style={{
          right: `${rightPosition}px`,
          marginTop: isFirst && !isCompleted ? 60 : 24,
        }}
      >
        {current ? (
          // Lição atual - com bolha "INICIAR"
          <div className="relative h-[110px] w-[110px]">
            <div className="absolute -top-9 left-1/2 z-20 -translate-x-1/2 rounded-2xl bg-white px-6 py-3 font-bold text-green-600 shadow-xl border border-green-200">
              INICIAR
              <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-white" />
            </div>

            <CircularProgressbarWithChildren
              value={Number.isNaN(percentage) ? 0 : percentage}
              styles={{
                path: { stroke: "#22c55e", strokeWidth: 8 },
                trail: { stroke: "#e5e7eb", strokeWidth: 8 },
              }}
            >
              <Button
                size="rounded"
                variant="secondary"
                className="h-[78px] w-[78px] border-b-8 border-green-600 bg-white shadow-xl hover:bg-green-50 active:scale-95 transition-all text-5xl"
              >
                {icon}
              </Button>
            </CircularProgressbarWithChildren>
          </div>
        ) : (
          // Lições normais (concluídas ou bloqueadas)
          <div className="relative h-[70px] w-[70px]">
            <Button
              size="rounded"
              variant={locked ? "locked" : "secondary"}
              className={cn(
                "h-[70px] w-[70px] border-b-8 text-4xl transition-all",
                isCompleted && "bg-green-500 border-green-600 text-white"
              )}
            >
              {icon}
            </Button>

            {/* Check pequeno no canto superior direito - apenas em lições concluídas */}
            {isCompleted && (
              <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-md border border-white">
                <Check className="h-5 w-5 text-green-600" strokeWidth={4} />
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};