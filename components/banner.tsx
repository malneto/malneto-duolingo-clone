"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { links } from "@/config";

type BannerProps = {
  hide: boolean;
  setHide: Dispatch<SetStateAction<boolean>>;
};

const BANNER_KEY = "hide-lingo-banner";

const Banner = ({ hide, setHide }: BannerProps) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const hideBanner = localStorage.getItem(BANNER_KEY);
    if (hideBanner) return;
    setHide(false);
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBannerClose = () => {
    setHide(true);
    localStorage.setItem(BANNER_KEY, "1");
  };

  if (hide || isScrolled) return null;

  return (
    <div
      id="sticky-banner"
      className="fixed left-0 top-0 z-50 flex h-20 w-full items-center justify-center px-4 sm:h-16 lg:h-10"
      style={{
        background: "linear-gradient(90deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2), rgba(99,102,241,0.25))",
        borderBottom: "1px solid rgba(99,102,241,0.4)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="relative flex w-full max-w-screen-lg items-center justify-center">
        <p className="text-center text-sm font-medium text-slate-300">
          🛸{" "}
          <strong className="font-extrabold text-white">
            Criação de conta temporariamente indisponível
          </strong>{" "}
          devido ao limite do Clerk.{" "}
          <Link
            href={`${links.sourceCode}/fork`}
            target="_blank"
            rel="noreferrer noopener"
            className="font-bold transition-opacity hover:opacity-75"
            style={{ color: "#67e8f9" }}
          >
            Fork o repositório
          </Link>{" "}
          ou{" "}
          <Link
            href={`mailto:${links.email}`}
            target="_blank"
            rel="noreferrer noopener"
            className="font-bold transition-opacity hover:opacity-75"
            style={{ color: "#67e8f9" }}
          >
            entre em contato
          </Link>{" "}
          para acesso.
        </p>

        <button
          onClick={handleBannerClose}
          type="button"
          className="absolute right-0 flex h-6 w-6 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#94a3b8",
          }}
        >
          <XIcon className="h-3 w-3" strokeWidth={3} />
          <span className="sr-only">Fechar</span>
        </button>
      </div>
    </div>
  );
};

export default Banner;