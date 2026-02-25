import Link from "next/link";

import { Button } from "@/components/ui/button";

type UnitBannerProps = {
  title: string;
  description: string;
  icon?: string;
};

export const UnitBanner = ({ 
  title, 
  description, 
  icon = "⭐" 
}: UnitBannerProps) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white shadow-md">
      <div className="flex items-center gap-4">
        
        {/* Ícone pequeno do assunto */}
        <div className="text-5xl flex-shrink-0">
          {icon}
        </div>

        {/* Textos */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold leading-tight line-clamp-2">
            {title}
          </h2>
          <p className="text-sm text-green-100 mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Botão CONTINUE ao lado */}
        <Link href="/lesson">
          <Button 
            variant="secondary" 
            className="border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold whitespace-nowrap px-6"
          >
            CONTINUE
          </Button>
        </Link>
      </div>
    </div>
  );
};