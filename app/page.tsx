"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MarketingPage() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f172a 60%, #1e1040 100%)" }}
    >
      {/* Stars */}
      {[
        [12,8],[25,22],[67,5],[80,15],[93,30],[5,45],[45,3],[88,60],
        [15,70],[55,85],[72,92],[35,50],[60,40],[90,80],[20,90],
      ].map(([l, t], i) => (
        <div key={i} className="pointer-events-none absolute rounded-full bg-white"
          style={{ left: `${l}%`, top: `${t}%`, width: i % 3 === 0 ? 2 : 1, height: i % 3 === 0 ? 2 : 1, opacity: 0.2 + (i % 5) * 0.1 }} />
      ))}

      {/* Nebula glows */}
      <div className="pointer-events-none absolute left-1/4 top-0 h-96 w-96 rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />

      <div className="relative z-10 flex w-full max-w-[988px] flex-col items-center justify-center gap-8 lg:flex-row lg:gap-16">

        {/* Hero image with orbital rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute rounded-full border border-indigo-500/20" style={{ width: 320, height: 320 }} />
          <div className="absolute rounded-full border border-cyan-500/10" style={{ width: 380, height: 380 }} />

          {/* Floating badges */}
          <div className="absolute -top-4 -right-4 rounded-2xl px-3 py-1.5 text-xs font-extrabold"
            style={{ background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", color: "#a5b4fc" }}>
            🚀 A1 → C1
          </div>
          <div className="absolute -bottom-2 -left-4 rounded-2xl px-3 py-1.5 text-xs font-extrabold"
            style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)", color: "#67e8f9" }}>
            ⚡ IA Adaptativa
          </div>

          <div className="relative h-[220px] w-[220px] lg:h-[340px] lg:w-[340px]">
            <Image src="/hero.svg" alt="Hero" fill className="drop-shadow-2xl" />
          </div>
        </div>

        {/* Text + CTA */}
        <div className="flex flex-col items-center gap-6 lg:items-start">
          <div className="flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
            🌌 Plataforma Galáctica de Inglês
          </div>

          <h1 className="max-w-[420px] text-center text-3xl font-extrabold leading-tight lg:text-left lg:text-4xl"
            style={{ background: "linear-gradient(135deg, #fff 30%, #a5b4fc 70%, #22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Aprenda inglês numa jornada pelo espaço
          </h1>

          <p className="max-w-[380px] text-center text-sm text-slate-400 lg:text-left">
            Lições adaptativas baseadas no seu nível CEFR. Quanto mais você aprende, mais o universo se expande.
          </p>

          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            {["🎯 CEFR A1–C1", "🤖 IA Adaptativa", "🔥 Streaks", "❤️ Vidas"].map((f) => (
              <span key={f} className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8" }}>
                {f}
              </span>
            ))}
          </div>

          <div className="flex w-full max-w-[330px] flex-col gap-3">
            <ClerkLoading>
              <Loader className="mx-auto h-5 w-5 animate-spin text-indigo-400" />
            </ClerkLoading>

            <ClerkLoaded>
              <SignedOut>
                <SignUpButton mode="modal">
                  <button className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-95"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}>
                    🚀 Começar jornada — é grátis
                  </button>
                </SignUpButton>

                <SignInButton mode="modal">
                  <button className="w-full rounded-2xl py-3.5 text-sm font-extrabold transition-all active:scale-95"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1.5px solid rgba(99,102,241,0.4)", color: "#a5b4fc" }}>
                    Já tenho conta
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Link href="/learn">
                  <button className="w-full rounded-2xl py-3.5 text-sm font-extrabold text-white transition-all active:scale-95"
                    style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 24px rgba(99,102,241,0.4)" }}>
                    🚀 Continuar jornada
                  </button>
                </Link>
              </SignedIn>
            </ClerkLoaded>
          </div>
        </div>
      </div>
    </div>
  );
}