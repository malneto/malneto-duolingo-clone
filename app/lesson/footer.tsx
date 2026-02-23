import { CheckCircle, XCircle } from "lucide-react";
import { useKey, useMedia } from "react-use";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FooterProps = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
}: FooterProps) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <footer
      className={cn(
        "h-[100px] border-t-2 lg:h-[140px]",
        status === "correct" && "border-transparent bg-green-100",
        status === "wrong" && "border-transparent bg-rose-100"
      )}
    >
      <div className="mx-auto flex h-full max-w-[1140px] items-center justify-between px-6 lg:px-10">
        {/* Mensagem quando acerta */}
        {status === "correct" && (
          <div className="flex items-center text-base font-bold text-green-500 lg:text-2xl">
            <CheckCircle className="mr-4 h-6 w-6 lg:h-10 lg:w-10" />
            Nicely done!
          </div>
        )}

        {/* Mensagem quando erra */}
        {status === "wrong" && (
          <div className="flex items-center text-base font-bold text-rose-500 lg:text-2xl">
            <XCircle className="mr-4 h-6 w-6 lg:h-10 lg:w-10" />
            Don&apos;t worry, this challenge will return later.
          </div>
        )}

        {/* Botão Next / Check */}
        <Button
          disabled={disabled}
          aria-disabled={disabled}
          className="ml-auto"
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
          variant={status === "wrong" ? "danger" : "default"}
        >
          {status === "none" && "Check"}
          {status === "correct" && "Next"}
          {status === "wrong" && "Next"}          {/* ← Sempre "Next" quando erra */}
          {status === "completed" && "Continue"}
        </Button>
      </div>
    </footer>
  );
};