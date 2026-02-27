import { Check } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type CardProps = {
  title: string;
  id: number;
  imageSrc: string;
  onClick: (id: number) => void;
  disabled?: boolean;
  isActive?: boolean;
};

export const Card = ({
  title,
  id,
  imageSrc,
  onClick,
  disabled,
  isActive,
}: CardProps) => {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        "relative group flex h-[170px] min-w-[200px] cursor-pointer flex-col items-center justify-between rounded-2xl p-5 shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-[1.02] hover:border-green-400 transition-all duration-300 bg-white overflow-hidden",
        disabled && "pointer-events-none opacity-50",
        isActive && "ring-2 ring-green-200/50 shadow-2xl border-green-400 bg-green-50"
      )}
    >
      {isActive && (
        <div className="absolute top-3 right-3 z-10 flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500 shadow-2xl">
          <Check className="h-6 w-6 stroke-[3px] text-white" />
        </div>
      )}

      <div className="flex-1 flex items-center justify-center" />

      <Image
        src={imageSrc}
        alt={title}
        width={56}
        height={56}
        className="w-14 h-14 rounded-2xl object-cover shadow-lg mb-4"
      />

      <p className="mt-auto text-center text-base md:text-lg font-bold text-neutral-800 flex-none">{title}</p>
    </div>
  );
};