import Image from "next/image";
import Link from "next/link";
import { MESSAGES } from "@/constants/messages";

export const Promo = () => {
  return (
    <div
      className="space-y-4 rounded-2xl p-4"
      style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))",
        border: "1.5px solid rgba(99,102,241,0.35)",
        boxShadow: "0 0 20px rgba(99,102,241,0.15)",
      }}
    >
      <div className="space-y-2">
        <div className="flex items-center gap-x-2">
          <Image src="/unlimited.svg" alt="Pro" height={26} width={26}
            style={{ filter: "drop-shadow(0 0 6px rgba(139,92,246,0.6))" }} />
          <h3 className="text-base font-extrabold text-white">{MESSAGES.promoTitle}</h3>
        </div>
        <p className="text-sm text-slate-400">{MESSAGES.promoDescription}</p>
      </div>

      <Link href="/shop">
        <button
          className="w-full rounded-xl py-3 text-sm font-extrabold tracking-wide transition-all duration-150 active:scale-[0.97]"
          style={{
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "#fff",
            boxShadow: "0 0 16px rgba(99,102,241,0.4), 0 3px 0 rgba(67,56,202,0.6)",
          }}
        >
          {MESSAGES.promoButton} ✨
        </button>
      </Link>
    </div>
  );
};