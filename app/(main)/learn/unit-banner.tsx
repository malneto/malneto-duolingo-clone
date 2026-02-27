import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    &lt;div className="sticky top-[56px] z-40 w-full max-w-[912px] mx-auto px-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-5 text-white shadow-2xl backdrop-blur-md border border-white/20"&gt;
      &lt;div className="flex items-center justify-between gap-4"&gt;
        &lt;div className="flex-1 min-w-0"&gt;
          &lt;p className="text-sm font-medium opacity-90 mb-1"&gt;
            Seção 1 U {unitOrder} de {totalUnits}
          &lt;/p&gt;
          &lt;h2 className="text-xl font-bold leading-tight line-clamp-1"&gt;
            {title}
          &lt;/h2&gt;
        &lt;/div&gt;
        &lt;Link href="/lesson"&gt;
          &lt;Button 
            variant="secondary" 
            className="border-2 border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold whitespace-nowrap px-6 py-2 flex-shrink-0"
          &gt;
            CONTINUE
          &lt;/Button&gt;
        &lt;/Link&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
};