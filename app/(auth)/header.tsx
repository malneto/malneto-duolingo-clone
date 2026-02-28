"use client";
import { useState } from "react";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedOut,
  useAuth,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Banner from "@/components/banner";
import { Button } from "@/components/ui/button";
import { links } from "@/config";
import { cn } from "@/lib/utils";
import { MESSAGES } from "@/constants/messages";

export const Header = () => {
  const { isSignedIn } = useAuth();
  const [hideBanner, setHideBanner] = useState(true);

  return (
    <>
      <Banner hide={hideBanner} setHide={setHideBanner} />

      <header
        className={cn(
          "h-20 w-full px-4",
          !hideBanner ? "mt-20 sm:mt-16 lg:mt-10" : "mt-0"
        )}
        style={{
          borderBottom: "1px solid rgba(99,102,241,0.2)",
          backdropFilter: "blur(12px)",
          background: "rgba(10,14,26,0.7)",
        }}
      >
        <div className="mx-auto flex h-full items-center justify-between lg:max-w-screen-lg">
          <Link href="/" className="flex items-center gap-x-3 pb-7 pl-4 pt-8">
            <div className="relative">
              <div
                className="absolute -inset-1 rounded-full opacity-50 blur-sm animate-pulse"
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
              {MESSAGES.appName}
            </h1>
          </Link>

          <div className="flex items-center gap-x-3">
            <ClerkLoading>
              <Loader className="h-5 w-5 animate-spin text-indigo-300" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedOut>
                <SignInButton>
                  <Button
                    size="lg"
                    variant="ghost"
                    className="font-bold text-slate-300 hover:text-white hover:bg-white/10"
                  >
                    Login
                  </Button>
                </SignInButton>
              </SignedOut>

              <Link
                href={links.sourceCode}
                target="_blank"
                rel="noreferrer noopener"
                className={cn("opacity-60 hover:opacity-100 transition-opacity", isSignedIn ? "pt-1.5" : "pt-3")}
              >
                <Image src="/github.svg" alt="Source Code" height={20} width={20} />
              </Link>
            </ClerkLoaded>
          </div>
        </div>
      </header>
    </>
  );
};