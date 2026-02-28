import { MobileSidebar } from "./mobile-sidebar";

export const MobileHeader = () => {
  return (
    <nav
      className="fixed top-0 z-50 flex h-[50px] w-full items-center px-4 lg:hidden"
      style={{
        background: "rgba(10,14,26,0.95)",
        borderBottom: "1px solid rgba(99,102,241,0.25)",
        backdropFilter: "blur(16px)",
      }}
    >
      <MobileSidebar />
    </nav>
  );
};