"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BottomNavigationProps = {
  className?: string;
};

const NAV_ITEMS = [
  { href: "/learn",       src: "/learn.svg",       alt: "Aprender"     },
  { href: "/leaderboard", src: "/leaderboard.svg",  alt: "Classificação" },
  { href: "/quests",      src: "/quests.svg",       alt: "Missões"      },
  { href: "/shop",        src: "/shop.svg",         alt: "Loja"         },
];

export const BottomNavigation = ({ className }: BottomNavigationProps) => {
  const pathname = usePathname();

  return (
    <div
      className={cn("fixed bottom-0 left-0 right-0 z-50 lg:hidden", className)}
      style={{
        background: "rgba(10,14,26,0.95)",
        borderTop: "1px solid rgba(99,102,241,0.25)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="mx-auto flex max-w-[1140px] items-center justify-around py-2">
        {NAV_ITEMS.map(({ href, src, alt }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-6 py-1 transition-all duration-150 active:scale-90"
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150"
                style={{
                  background: isActive ? "rgba(99,102,241,0.2)" : "transparent",
                  border: isActive ? "1px solid rgba(99,102,241,0.5)" : "1px solid transparent",
                  boxShadow: isActive ? "0 0 12px rgba(99,102,241,0.3)" : "none",
                }}
              >
                <Image
                  src={src}
                  alt={alt}
                  width={24}
                  height={24}
                  style={{ opacity: isActive ? 1 : 0.45, filter: isActive ? "drop-shadow(0 0 4px rgba(99,102,241,0.6))" : "none" }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};