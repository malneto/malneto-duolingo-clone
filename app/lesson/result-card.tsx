import { InfinityIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type ResultCardProps = { value: number; variant: "points" | "hearts" };

export const ResultCard = ({ value, variant }: ResultCardProps) => {
  const isPoints = variant === "points";
  const color = isPoints ? "#fbbf24" : "#f87171";
  const glow = isPoints ? "rgba(251,191,36,0.3)" : "rgba(248,113,113,0.3)";
  const label = isPoints ? "⚡ Total XP" : "❤️ Vidas";

  return (
    <div className="w-full rounded-2xl overflow-hidden"
      style={{ border: `1.5px solid ${color}44`, boxShadow: `0 0 20px ${glow}` }}>
      <div className="py-1.5 text-center text-xs font-extrabold uppercase tracking-widest"
        style={{ background: `${color}22`, color }}>
        {label}
      </div>
      <div className="flex items-center justify-center gap-2 py-6"
        style={{ background: "rgba(10,14,26,0.8)" }}>
        <Image src={isPoints ? "/points.svg" : "/heart.svg"} alt={variant} height={28} width={28} />
        <span className="text-2xl font-extrabold" style={{ color }}>
          {value === Infinity ? <InfinityIcon className="h-7 w-7 stroke-[3]" /> : value}
        </span>
      </div>
    </div>
  );
};