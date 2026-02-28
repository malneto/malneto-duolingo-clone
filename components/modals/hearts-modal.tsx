"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHeartsModal } from "@/store/use-hearts-modal";

export const HeartsModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useHeartsModal();

  useEffect(() => setIsClient(true), []);

  const onClick = () => { close(); router.push("/store"); };

  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        className="max-w-md border-0 p-0"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #1e1040 100%)",
          border: "1.5px solid rgba(248,113,113,0.4)",
          boxShadow: "0 0 60px rgba(248,113,113,0.15), 0 24px 48px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          {/* Heart icon with glow */}
          <div
            className="relative mb-5 flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(248,113,113,0.2), rgba(239,68,68,0.1))",
              border: "2px solid rgba(248,113,113,0.4)",
              boxShadow: "0 0 30px rgba(248,113,113,0.3)",
            }}
          >
            <Image src="/mascot_bad.svg" alt="Mascot Bad" height={64} width={64} />
            <span className="absolute -bottom-1 -right-1 text-xl">💔</span>
          </div>

          <DialogHeader>
            <DialogTitle className="mb-2 text-center text-2xl font-extrabold text-white">
              Sem vidas! 😢
            </DialogTitle>
            <DialogDescription className="text-center text-base text-slate-400">
              Obtenha o plano Pro para vidas infinitas, ou compre na loja galáctica.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 w-full space-y-3">
            <button
              onClick={onClick}
              className="w-full rounded-2xl py-4 text-base font-extrabold tracking-wide transition-all duration-150 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #f87171, #ef4444)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(248,113,113,0.4), 0 4px 0 rgba(220,38,38,0.6)",
              }}
            >
              ❤️ Obter vidas infinitas
            </button>

            <button
              onClick={close}
              className="w-full rounded-2xl py-3 text-sm font-bold transition-all duration-150 hover:opacity-80"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                color: "#64748b",
              }}
            >
              Não, obrigado
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};