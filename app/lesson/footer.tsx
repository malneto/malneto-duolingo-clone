import { CheckCircle, XCircle } from "lucide-react";
import { useKey, useMedia } from "react-use";

import { Button } from "@/components/ui/button";
import { MESSAGES } from "@/constants/messages";

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
    <footer className="fixed bottom-0 left-0 right-0 border-t-2 bg-white py-4 lg:py-6 z-50">
      <div className="mx-auto max-w-[1140px] px-6 lg:px-10">
        
        {status === "correct" && (
          <div className="mb-4 flex items-center gap-3 text-green-600 font-bold text-xl">
            <CheckCircle className="h-8 w-8" />
            {MESSAGES.wellDone}
          </div>
        )}

        {status === "wrong" && (
          <div className="mb-4 flex items-center gap-3 text-rose-600 font-bold text-xl">
            <XCircle className="h-8 w-8" />
            {MESSAGES.tryAgain}
          </div>
        )}

        <Button
          onClick={onCheck}
          disabled={disabled}
          className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.97] bg-green-500 hover:bg-green-600 text-white"
        >
          {status === "none" && MESSAGES.verify}
          {(status === "correct" || status === "wrong" || status === "completed") && MESSAGES.continue}
        </Button>
      </div>
    </footer>
  );
};