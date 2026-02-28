"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarItemProps = {
  label: string;
  iconSrc: string;
  href: string;
};

export const SidebarItem = ({ label, iconSrc, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <div
        className="flex h-[52px] w-full cursor-pointer items-center gap-x-4 rounded-xl px-4 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
          border: isActive ? "1px solid rgba(99,102,241,0.4)" : "1px solid transparent",
          boxShadow: isActive ? "0 0 12px rgba(99,102,241,0.2)" : "none",
        }}
      >
        <Image
          src={iconSrc}
          alt={label}
          height={32}
          width={32}
          style={{
            filter: isActive ? "drop-shadow(0 0 4px rgba(99,102,241,0.7))" : "none",
            opacity: isActive ? 1 : 0.5,
          }}
        />
        <span
          className="text-sm font-bold tracking-wide"
          style={{ color: isActive ? "#a5b4fc" : "#64748b" }}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};