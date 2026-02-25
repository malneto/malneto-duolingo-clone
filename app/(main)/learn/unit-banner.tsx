import { NotebookText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type UnitBannerProps = {
  title: string;
  description: string;
  icon?: string;           // ← Novo: Ícone grande da unidade
};

export const UnitBanner = ({ 
  title, 
  description, 
  icon = "⭐"               // Valor padrão caso não tenha ícone
}: UnitBannerProps) => {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white overflow-hidden">
      {/* Ícone grande no fundo */}
      <div className="absolute -right-6 -top-8 text-[120px] opacity-20">
        {icon}
      </div>

      <div className="flex items-start gap-6 relative z-10">
        {/* Ícone principal */}
        <div className="text-6xl flex-shrink-0">
          {icon}
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl font-bold tracking-tight">{title}</h3>
          <p className="text-lg text-white/90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <Link href="/lesson" className="mt-6 block">
        <Button
          size="lg"
          variant="secondary"
          className="border-2 border-b-4 active:border-b-2 border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold"
        >
          <NotebookText className="mr-2 h-5 w-5" />
          Continue
        </Button>
      </Link>
    </div>
  );
};