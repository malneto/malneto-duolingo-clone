"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export const BottomNavigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 lg:hidden">
      <div className="flex items-center justify-around py-2 max-w-[1140px] mx-auto">
        
        {/* APRENDER */}
        <Link href="/learn" className={`flex flex-col items-center py-1 px-6 ${isActive('/learn') ? 'opacity-100' : 'opacity-60'}`}>
          <Image src="/learn.svg" alt="Aprender" width={32} height={32} />
        </Link>

        {/* CLASSIFICAÇÃO */}
        <Link href="/leaderboard" className={`flex flex-col items-center py-1 px-6 ${isActive('/leaderboard') ? 'opacity-100' : 'opacity-60'}`}>
          <Image src="/leaderboard.svg" alt="Classificação" width={32} height={32} />
        </Link>

        {/* MISSÕES */}
        <Link href="/quests" className={`flex flex-col items-center py-1 px-6 ${isActive('/quests') ? 'opacity-100' : 'opacity-60'}`}>
          <Image src="/quests.svg" alt="Missões" width={32} height={32} />
        </Link>

        {/* LOJA */}
        <Link href="/shop" className={`flex flex-col items-center py-1 px-6 ${isActive('/shop') ? 'opacity-100' : 'opacity-60'}`}>
          <Image src="/shop.svg" alt="Loja" width={32} height={32} />
        </Link>

      </div>
    </div>
  );
};