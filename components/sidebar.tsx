import { ClerkLoading, ClerkLoaded, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { SidebarItem } from "./sidebar-item";
import { MESSAGES } from "@/constants/messages";

type SidebarProps = {
  className?: string;
};

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div
      className={cn(
        "left-0 top-0 flex h-full flex-col px-4 lg:fixed lg:w-[256px]",
        className
      )}
      style={{
        background: "rgba(10,14,26,0.97)",
        borderRight: "1px solid rgba(99,102,241,0.2)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Logo */}
      <Link href="/learn">
        <div className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-full opacity-40 blur-sm animate-pulse"
              style={{ background: "radial-gradient(circle, #22d3ee, transparent)" }}
            />
            <Image src="/mascot.svg" alt="Mascot" height={40} width={40} className="relative" />
          </div>
          <h1
            className="text-2xl font-extrabold tracking-wide"
            style={{
              background: "linear-gradient(90deg, #22d3ee, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Lingo
          </h1>
        </div>
      </Link>

      {/* Nav items */}
      <div className="flex flex-1 flex-col gap-y-1">
        <SidebarItem label={MESSAGES.learn}       href="/learn"        iconSrc="/learn.svg"       />
        <SidebarItem label={MESSAGES.leaderboard} href="/leaderboard"  iconSrc="/leaderboard.svg" />
        <SidebarItem label={MESSAGES.quests}      href="/quests"       iconSrc="/quests.svg"      />
        <SidebarItem label={MESSAGES.shop}        href="/shop"         iconSrc="/shop.svg"        />
      </div>

      {/* User button */}
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 animate-spin text-indigo-300" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { userButtonPopoverCard: { pointerEvents: "initial" } },
            }}
          />
        </ClerkLoaded>
      </div>
    </div>
  );
};