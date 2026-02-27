import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Notebook } from "lucide-react";

type UnitBannerProps = {
  unitOrder: number;
  totalUnits: number;
  title: string;
};

export const UnitBanner = ({ 
  unitOrder, 
  totalUnits, 
  title 
}: UnitBannerProps) => {
  return (
    <div className="sticky top-[56px] z-40 w-full max-w-[912px] mx-auto px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white shadow-2xl backdrop-blur-md border border-white/20">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium opacity-90 mb-1">
            Seção 1 U {unitOrder} de {totalUnits}
          </p>
          <h2 className="text-xl font-bold leading-tight line-clamp-1">
            {title}
          </h2>
        </div>
        <Link href="/lesson">
          <Button 
            variant="secondary" size="icon" 
            className="border-2 border-white/30 bg-white/10 hover:bg-white/20 h-10 w-10 flex-shrink-0"
          >
            <Notebook className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};