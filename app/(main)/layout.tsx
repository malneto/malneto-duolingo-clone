import type { PropsWithChildren } from "react";

import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

// Starfield SSR-safe (valores fixos, sem Math.random)
const STARS = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  top: `${(i * 37 + 11) % 100}%`,
  left: `${(i * 61 + 7) % 100}%`,
  size: (i % 3) + 1,
  opacity: 0.1 + (i % 5) * 0.07,
}));

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f172a 60%, #1e1040 100%)" }}
    >
      {/* Starfield */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        {STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{ width: s.size, height: s.size, top: s.top, left: s.left, opacity: s.opacity }}
          />
        ))}
        {/* Nebula glows */}
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #e879f9, transparent)" }} />
      </div>

      {/* App shell */}
      <div className="relative z-10">
        <MobileHeader />
        <Sidebar className="hidden lg:flex" />
        <main className="h-full pt-[50px] lg:pl-[256px] lg:pt-0">
          <div className="mx-auto h-full max-w-[1056px] pt-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;