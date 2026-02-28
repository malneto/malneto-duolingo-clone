"use client";

import { useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { refillHearts } from "@/actions/user-progress";
import { createStripeUrl } from "@/actions/user-subscription";
import { MAX_HEARTS, POINTS_TO_REFILL } from "@/constants";

type ItemsProps = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({ hearts, points, hasActiveSubscription }: ItemsProps) => {
  const [pending, startTransition] = useTransition();

  const onRefillHearts = () => {
    if (pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL) return;
    startTransition(() => {
      refillHearts().catch(() => toast.error("Something went wrong."));
    });
  };

  const onUpgrade = () => {
    toast.loading("Redirecting to checkout...");
    startTransition(() => {
      createStripeUrl()
        .then((res) => { if (res.data) window.location.href = res.data; })
        .catch(() => toast.error("Something went wrong."));
    });
  };

  const heartsDisabled = pending || hearts === MAX_HEARTS || points < POINTS_TO_REFILL;
  const heartsFull = hearts === MAX_HEARTS;

  return (
    <ul className="w-full space-y-4">

      {/* Refill Hearts */}
      <li
        className="flex w-full items-center gap-5 rounded-2xl px-5 py-4 transition-all duration-150"
        style={{
          background: "rgba(15,23,42,0.6)",
          border: "1.5px solid rgba(248,113,113,0.3)",
          boxShadow: "0 0 16px rgba(248,113,113,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Icon */}
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
          style={{ background: "rgba(248,113,113,0.1)", border: "1.5px solid rgba(248,113,113,0.3)" }}
        >
          <Image src="/heart.svg" alt="Heart" height={40} width={40} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-extrabold text-white">Recarregar vidas</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {heartsFull ? "Você já está com vidas cheias!" : `Custa ${POINTS_TO_REFILL} XP`}
          </p>
          {/* Mini heart bar */}
          <div className="mt-2 flex gap-1">
            {Array.from({ length: MAX_HEARTS }).map((_, i) => (
              <span key={i} className="text-sm">{i < hearts ? "❤️" : "🖤"}</span>
            ))}
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onRefillHearts}
          disabled={heartsDisabled}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-extrabold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: heartsDisabled
              ? "rgba(248,113,113,0.1)"
              : "linear-gradient(135deg, #f87171, #ef4444)",
            border: "1.5px solid rgba(248,113,113,0.5)",
            color: heartsDisabled ? "#fca5a5" : "#fff",
            boxShadow: heartsDisabled ? "none" : "0 0 16px rgba(248,113,113,0.35)",
          }}
        >
          {heartsFull ? (
            "Cheio ✓"
          ) : (
            <>
              <Image src="/points.svg" alt="Points" height={18} width={18} />
              <span>{POINTS_TO_REFILL}</span>
            </>
          )}
        </button>
      </li>

      {/* Unlimited Hearts */}
      <li
        className="flex w-full items-center gap-5 rounded-2xl px-5 py-4 transition-all duration-150"
        style={{
          background: hasActiveSubscription
            ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(15,23,42,0.8))"
            : "rgba(15,23,42,0.6)",
          border: `1.5px solid ${hasActiveSubscription ? "rgba(99,102,241,0.5)" : "rgba(139,92,246,0.3)"}`,
          boxShadow: hasActiveSubscription ? "0 0 20px rgba(99,102,241,0.2)" : "0 0 16px rgba(139,92,246,0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        {/* Icon */}
        <div
          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl"
          style={{
            background: "rgba(139,92,246,0.12)",
            border: "1.5px solid rgba(139,92,246,0.4)",
          }}
        >
          <Image src="/unlimited.svg" alt="Unlimited" height={40} width={40} />
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="font-extrabold text-white">Vidas infinitas</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {hasActiveSubscription ? "Plano galáctico ativo 🚀" : "Explore sem limites pelo universo"}
          </p>
          {hasActiveSubscription && (
            <span
              className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest"
              style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", color: "#a5b4fc" }}
            >
              ✨ Pro ativo
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={onUpgrade}
          disabled={pending}
          className="rounded-xl px-4 py-2.5 text-sm font-extrabold transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: hasActiveSubscription
              ? "rgba(99,102,241,0.2)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            border: "1.5px solid rgba(99,102,241,0.5)",
            color: hasActiveSubscription ? "#a5b4fc" : "#fff",
            boxShadow: hasActiveSubscription ? "none" : "0 0 16px rgba(99,102,241,0.35)",
          }}
        >
          {hasActiveSubscription ? "Gerenciar" : "⚡ Upgrade"}
        </button>
      </li>
    </ul>
  );
};