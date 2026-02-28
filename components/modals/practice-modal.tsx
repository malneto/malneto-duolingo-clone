"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MESSAGES } from "@/constants/messages";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePracticeModal } from "@/store/use-practice-modal";

export const PracticeModal = () => {
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = usePracticeModal();

  useEffect(() => setIsClient(true), []);
  if (!isClient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent
        className="max-w-md border-0 p-0"
        style={{
          background: "linear-gradient(160deg, #0f172a 0%, #1e1040 100%)",
          border: "1.5px solid rgba(74,222,128,0.4)",
          boxShadow: "0 0 60px rgba(74,222,128,0.15), 0 24px 48px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          {/* Heart with glow */}
          <div
            className="mb-5 flex h-24 w-24 items-center justify-center rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,197,94,0.1))",
              border: "2px solid rgba(74,222,128,0.4)",
              boxShadow: "0 0 30px rgba(74,222,128,0.3)",
            }}
          >
            <Image src="/heart.svg" alt="Heart" height={60} width={60}
              style={{ filter: "drop-shadow(0 0 8px rgba(74,222,128,0.5))" }} />
          </div>

          <DialogHeader>
            <DialogTitle className="mb-2 text-center text-2xl font-extrabold text-white">
              {MESSAGES.practiceLesson}
            </DialogTitle>
            <DialogDescription className="text-center text-base text-slate-400">
              {MESSAGES.praticeLessonUse}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8 w-full">
            <button
              onClick={close}
              className="w-full rounded-2xl py-4 text-base font-extrabold tracking-wide transition-all duration-150 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #4ade80, #22c55e)",
                color: "#0f172a",
                boxShadow: "0 0 20px rgba(74,222,128,0.4), 0 4px 0 rgba(21,128,61,0.6)",
              }}
            >
              🚀 {MESSAGES.iUndertand}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};