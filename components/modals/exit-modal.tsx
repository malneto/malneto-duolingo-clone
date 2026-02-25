"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/constants/messages";   // ← Import adicionado

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <DialogContent className="max-w-md p-0">
        <div className="flex flex-col items-center px-8 pt-10 pb-8 text-center">
          {/* Carinha triste amarela - igual Duolingo */}
          <div className="mb-6 text-8xl">😟</div>

          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-neutral-800 mb-2 text-center">
              {MESSAGES.exitModalTitle}
            </DialogTitle>
            <DialogDescription className="text-lg text-neutral-600">
              {MESSAGES.exitModalDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-10 w-full space-y-4">
            {/* Botão azul grande - Continuar aprendendo */}
            <Button
              onClick={close}
              className="w-full h-14 text-lg font-bold bg-blue-500 hover:bg-blue-600 text-white rounded-2xl"
            >
              {MESSAGES.keepLearning}
            </Button>

            {/* Link vermelho - Encerrar sessão */}
            <button
              onClick={() => {
                close();
                router.push("/learn");
              }}
              className="text-rose-500 font-bold text-lg hover:text-rose-600 transition-colors py-2"
            >
              {MESSAGES.endSession}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};