"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/constants/messages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExitModal } from "@/store/use-exit-modal";

export const ExitModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useExitModal();

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        className="max-w-md border-0 p-0"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #1e1040 100%)",
          border: "1.5px solid rgba(99,102,241,0.4)",
          boxShadow: "0 0 60px rgba(99,102,241,0.2), 0 24px 48px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          {/* Space emoji */}
          <div
            className="mb-5 flex h-24 w-24 items-center justify-center rounded-full text-5xl"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))",
              border: "2px solid rgba(99,102,241,0.4)",
              boxShadow: "0 0 24px rgba(99,102,241,0.3)",
            }}
          >
            🛸
          </div>

          <DialogHeader>
            <DialogTitle className="mb-2 text-center text-2xl font-extrabold text-white">
              {MESSAGES.exitModalTitle}
            </DialogTitle>
            <DialogDescription className="text-center text-base text-slate-400">
              {MESSAGES.exitModalDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 w-full space-y-3">
            <button
              onClick={close}
              className="w-full rounded-2xl py-4 text-base font-extrabold tracking-wide transition-all duration-150 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(99,102,241,0.4), 0 4px 0 rgba(67,56,202,0.6)",
              }}
            >
              🚀 {MESSAGES.keepLearning}
            </button>

            <button
              onClick={() => { close(); router.push("/learn"); }}
              className="w-full rounded-2xl py-3 text-sm font-bold transition-all duration-150 hover:opacity-80"
              style={{
                background: "rgba(248,113,113,0.08)",
                border: "1.5px solid rgba(248,113,113,0.3)",
                color: "#fca5a5",
              }}
            >
              {MESSAGES.endSession}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};