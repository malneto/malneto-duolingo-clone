"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, Target, ShoppingBag } from "lucide-react";

import { MESSAGES } from "@/constants/messages";

export const BottomNavigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 lg:hidden">
      <div className="flex items-center justify-around py-2 max-w-[1140px] mx-auto">
        
        <Link href="/learn" className={`flex flex-col items-center gap-1 py-1 px-4 ${isActive('/learn') ? 'text-green-600' : 'text-neutral-500'}`}>
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">{MESSAGES.learn}</span>
        </Link>

        <Link href="/leaderboard" className={`flex flex-col items-center gap-1 py-1 px-4 ${isActive('/leaderboard') ? 'text-green-600' : 'text-neutral-500'}`}>
          <Trophy className="w-6 h-6" />
          <span className="text-xs font-medium">{MESSAGES.leaderboard}</span>
        </Link>

        <Link href="/quests" className={`flex flex-col items-center gap-1 py-1 px-4 ${isActive('/quests') ? 'text-green-600' : 'text-neutral-500'}`}>
          <Target className="w-6 h-6" />
          <span className="text-xs font-medium">{MESSAGES.quests}</span>
        </Link>

        <Link href="/shop" className={`flex flex-col items-center gap-1 py-1 px-4 ${isActive('/shop') ? 'text-green-600' : 'text-neutral-500'}`}>
          <ShoppingBag className="w-6 h-6" />
          <span className="text-xs font-medium">{MESSAGES.shop}</span>
        </Link>

      </div>
    </div>
  );
};