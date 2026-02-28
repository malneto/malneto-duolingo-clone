import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  return (
    <div
      className="sticky top-0 z-50 mb-5 flex items-center justify-between px-2 pb-3 lg:mt-[-28px] lg:pt-[28px]"
      style={{
        background: "rgba(10,14,26,0.9)",
        borderBottom: "1px solid rgba(99,102,241,0.2)",
        backdropFilter: "blur(12px)",
      }}
    >
      <Link href="/courses">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-110 active:scale-95"
          style={{
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.3)",
            color: "#94a3b8",
          }}
        >
          <ArrowLeft className="h-5 w-5 stroke-2" />
        </button>
      </Link>

      <h1
        className="text-lg font-extrabold tracking-wide"
        style={{
          background: "linear-gradient(90deg, #e2e8f0, #a5b4fc)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </h1>

      <div aria-hidden className="h-9 w-9" />
    </div>
  );
};