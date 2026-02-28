import type { Metadata } from "next";

export const siteConfig: Metadata = {
  title: "Lingo — Aprenda Inglês no Espaço",
  description:
    "Plataforma interativa de aprendizado de inglês com lições adaptativas, missões e progressão inteligente baseada no seu nível CEFR.",
  keywords: [
    "aprender inglês",
    "inglês para crianças",
    "duolingo",
    "lingo",
    "CEFR",
    "nextjs",
    "reactjs",
  ] as Array<string>,
  authors: {
    name: "Malneto",
  },
  icons: {
    icon: [
      { url: "/icons/icon-32.png",  sizes: "32x32",   type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/icons/apple-icon.png", sizes: "180x180", type: "image/png" },
    shortcut: "/icons/icon-32.png",
  },
} as const;

export const links = {
  sourceCode: "https://github.com/sanidhyy/duolingo-clone",
  email: "sanidhya.verma12345@gmail.com",
} as const;