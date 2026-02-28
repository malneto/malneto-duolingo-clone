import { MobileSidebar } from "./mobile-sidebar";

import Link from "next/link";
import Image from "next/image";

export const MobileHeader = () => {
  return (
    <nav className="fixed top-0 z-50 flex h-[50px] w-full items-center border-b bg-green-500 px-4 lg:hidden">
      {/* ÍCONE BANDEIRA CURSO - Top bar esquerda */}
      <Link href="/courses" className="mr-2">
        <Image 
          src="https://flagcdn.com/w320/us.png" 
          alt="Curso Inglês (US)" 
          height={32} 
          width={32}
          className="h-8 w-auto rounded-full" 
        />
      </Link>
      <MobileSidebar />
    </nav>
  );
};
