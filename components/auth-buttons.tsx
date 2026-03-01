"use client";

import { ClerkLoaded, ClerkLoading, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";

export const AuthButtons = () => {
  return (
    <div className="flex flex-col gap-3">
      <ClerkLoading>
        <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-400" />
      </ClerkLoading>

      <ClerkLoaded>
        <SignUpButton mode="modal">
          <button
            className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}
          >
            🚀 Começar jornada — é grátis
          </button>
        </SignUpButton>

        <SignInButton mode="modal">
          <button
            className="w-full rounded-2xl py-3.5 text-sm font-extrabold transition-all active:scale-95"
            style={{ background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.4)", color: "#a5b4fc" }}
          >
            Já tenho conta
          </button>
        </SignInButton>
      </ClerkLoaded>
    </div>
  );
};