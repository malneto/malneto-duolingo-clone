import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="hidden">
        <Menu style={{ color: "#a5b4fc" }} />
      </SheetTrigger>

      <SheetContent
        className="z-[100] p-0"
        side="left"
        style={{ background: "rgba(10,14,26,0.98)", border: "none" }}
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};