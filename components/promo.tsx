import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/constants/messages";   // ← Import adicionado

export const Promo = () => {
  return (
    <div className="space-y-4 rounded-xl border-2 p-4">
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Image src="/unlimited.svg" alt="Pro" height={26} width={26} />

          <h3 className="text-lg font-bold">{MESSAGES.promoTitle}</h3>
        </div>

        <p className="text-muted-foreground">{MESSAGES.promoDescription}</p>
      </div>

      <Button variant="super" className="w-full" size="lg" asChild>
        <Link href="/shop">{MESSAGES.promoButton}</Link>
      </Button>
    </div>
  );
};