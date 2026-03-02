"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";
import { useAudio, useWindowSize, useMount } from "react-use";
import { toast } from "sonner";

import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { reduceHearts } from "@/actions/user-progress";
import { MAX_HEARTS } from "@/constants";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Challenge } from "./challenge";
import { CharacterBubble } from "./character-bubble";
import { Footer } from "./footer";
import { Header } from "./header";
import { ResultCard } from "./result-card";
import { Translate } from "./translate";
import { FillInBlank } from "./fill-in-blank";
import { ListenAndType } from "./listen-and-type";
import { Match } from "./match";
import { Speak } from "./speak";
import { Video } from "./video";
import { MESSAGES } from "@/constants/messages";

type QuizProps = {
  initialPercentage: number;
  initialHearts: number;
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  userSubscription: (typeof userSubscription.$inferSelect & { isActive: boolean }) | null;
  currentStreak?: number;
};

const TEXT_INPUT_TYPES = ["TRANSLATE", "FILL_IN_BLANK", "LISTEN_AND_TYPE"];

const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i, top: `${(i * 37 + 11) % 100}%`, left: `${(i * 61 + 7) % 100}%`,
  size: (i % 3) + 1, dur: `${((i % 4) + 2)}s`, delay: `${(i % 5) * 0.4}s`,
}));

const SpaceBackground = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
    {STARS.map((s) => (
      <div key={s.id} className="absolute rounded-full bg-white animate-pulse"
        style={{ width: s.size, height: s.size, top: s.top, left: s.left, opacity: 0.5, animationDuration: s.dur, animationDelay: s.delay }} />
    ))}
    <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
    <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, #0891b2, transparent)" }} />
    <div className="absolute top-1/2 left-1/2 h-48 w-48 rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, #e879f9, transparent)" }} />
  </div>
);

const TYPE_LABELS: Record<string, string> = {
  ASSIST:          "🔊 Escute e selecione a resposta certa",
  SELECT:          "❓ Escolha a resposta certa",
  TRANSLATE:       "🌍 Traduza para o inglês",
  FILL_IN_BLANK:   "✏️ Complete a frase",
  LISTEN_AND_TYPE: "👂 Ouça e escreva",
  MATCH:           "🔗 Conecte os pares",
  SPEAK:           "🎙️ Fale em voz alta",
};

export const Quiz = ({
  initialPercentage, initialHearts, initialLessonId,
  initialLessonChallenges, userSubscription, currentStreak = 0,
}: QuizProps) => {
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({ src: "/incorrect.wav" });
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPracticeModal } = usePracticeModal();
  const textSubmitRef = useRef<(() => void) | null>(null);

  useMount(() => { if (initialPercentage === 100) openPracticeModal(); });

  const [lessonId] = useState(initialLessonId);
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => initialPercentage === 100 ? 0 : initialPercentage);
  const shuffle = <T,>(arr: T[]): T[] => arr.map((v) => ({ v, r: Math.random() })).sort((a, b) => a.r - b.r).map(({ v }) => v);
  const sorted = [...initialLessonChallenges].sort((a, b) => a.order - b.order).map((c) => ({ ...c, challengeOptions: shuffle(c.challengeOptions) }));
  const [challenges] = useState(sorted);
  const [activeIndex, setActiveIndex] = useState(() => { const i = challenges.findIndex((c) => !c.completed); return i === -1 ? 0 : i; });
  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"none" | "wrong" | "correct">("none");

  const challenge = challenges[activeIndex];
  const options = challenge?.challengeOptions ?? [];
  const type = challenge?.type as string;
  const isTextInput = TEXT_INPUT_TYPES.includes(type);

  // Correct answer text for footer
  const correctAnswer = options.find((o) => o.correct)?.text;

  // For ASSIST: replace ____ with correct answer for speech
  const assistSpeakText = type === "ASSIST"
    ? (challenge?.question ?? "").replace(/_{2,}/g, correctAnswer ?? "").replace(/\s*\([^)]*\)\s*/g, " ").trim()
    : undefined;

  if (!challenge) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center"
        style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f172a 60%, #1a0a2e 100%)" }}>
        <SpaceBackground />
        {finishAudio}{correctAudio}{incorrectAudio}
        <Confetti recycle={false} numberOfPieces={600} tweenDuration={8000} width={width} height={height} colors={["#a78bfa","#22d3ee","#f472b6","#fbbf24","#fff"]} />
        <div className="relative z-10 flex max-w-lg flex-col items-center gap-y-6 px-6 text-center">
          <div className="text-8xl animate-bounce">🚀</div>
          <div>
            <h1 className="text-3xl font-extrabold text-white lg:text-4xl">{MESSAGES.greatJob}</h1>
            <p className="mt-2 text-lg font-bold text-cyan-300">{MESSAGES.youCompletedTheLesson}</p>
            <p className="mt-1 text-sm text-indigo-300">Missão cumprida, astronauta! 🌌</p>
          </div>
          <div className="flex w-full gap-x-4">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={userSubscription?.isActive ? Infinity : hearts} />
          </div>
        </div>
        <Footer lessonId={lessonId} status="completed" onCheck={() => router.push("/learn")} />
      </div>
    );
  }

  const onNext = () => setActiveIndex((c) => c + 1);
  const onSelect = (id: number) => { if (status !== "none") return; setSelectedOption(id); };

  const handleTextResult = (isCorrect: boolean) => {
    if (isCorrect) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id).then((res) => {
          if (res?.error === "hearts") { openHeartsModal(); return; }
          void correctControls.play(); setStatus("correct");
          setPercentage((p) => p + 100 / challenges.length);
          if (initialPercentage === 100) setHearts((h) => Math.min(h + 1, MAX_HEARTS));
        }).catch(() => toast.error("Something went wrong."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id).then((res) => {
          if (res?.error === "hearts") { openHeartsModal(); return; }
          void incorrectControls.play(); setStatus("wrong");
          if (!res?.error) setHearts((h) => Math.max(h - 1, 0));
        }).catch(() => toast.error("Something went wrong."));
      });
    }
  };

  const onContinue = () => {
    if (status === "wrong")   { setStatus("none"); setSelectedOption(undefined); return; }
    if (status === "correct") { onNext(); setStatus("none"); setSelectedOption(undefined); return; }
    if (isTextInput)          { textSubmitRef.current?.(); return; }
    if (type === "MATCH") {
      if (!selectedOption) return;
      if (selectedOption === -1) {
        startTransition(() => { reduceHearts(challenge.id).then((res) => { if (res?.error === "hearts") { openHeartsModal(); return; } void incorrectControls.play(); setStatus("wrong"); if (!res?.error) setHearts((h) => Math.max(h - 1, 0)); }).catch(() => toast.error("Something went wrong.")); });
      } else {
        startTransition(() => { upsertChallengeProgress(challenge.id).then((res) => { if (res?.error === "hearts") { openHeartsModal(); return; } void correctControls.play(); setStatus("correct"); setPercentage((p) => p + 100 / challenges.length); if (initialPercentage === 100) setHearts((h) => Math.min(h + 1, MAX_HEARTS)); }).catch(() => toast.error("Something went wrong.")); });
      }
      return;
    }
    if (!selectedOption) return;
    const correctOpt = options.find((o) => o.correct);
    if (!correctOpt) return;
    if (correctOpt.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id).then((res) => {
          if (res?.error === "hearts") { openHeartsModal(); return; }
          void correctControls.play(); setStatus("correct");
          setPercentage((p) => p + 100 / challenges.length);
          if (initialPercentage === 100) setHearts((h) => Math.min(h + 1, MAX_HEARTS));
        }).catch(() => toast.error("Something went wrong."));
      });
    } else {
      startTransition(() => {
        reduceHearts(challenge.id).then((res) => {
          if (res?.error === "hearts") { openHeartsModal(); return; }
          void incorrectControls.play(); setStatus("wrong");
          if (!res?.error) setHearts((h) => Math.max(h - 1, 0));
        }).catch(() => toast.error("Something went wrong."));
      });
    }
  };

  const isFooterDisabled = pending || (status === "none" && !selectedOption && type !== "MATCH");
  const typeLabel = TYPE_LABELS[type] ?? "Escolha a resposta certa";

  // Which types show the shared CharacterBubble
  // FILL_IN_BLANK has its own built-in, VIDEO and SPEAK have their own layout
  const showCharacterBubble = type !== "VIDEO" && type !== "FILL_IN_BLANK" && type !== "SPEAK";

  return (
    <div className="relative flex min-h-screen flex-col"
      style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #0f172a 60%, #1e1040 100%)" }}>
      <SpaceBackground />
      {incorrectAudio}{correctAudio}

      <div className="relative z-10">
        <Header hearts={hearts} percentage={percentage} hasActiveSubscription={!!userSubscription?.isActive} />
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-4 pb-48 pt-6">
        <div className="flex w-full max-w-[600px] flex-col gap-y-5">

          {/* Type label */}
          <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-400 lg:text-start">
            {typeLabel}
          </p>

          {/* Shared character bubble */}
          {showCharacterBubble && (
            <CharacterBubble
              question={challenge.question}
              seedId={challenge.id}
              autoSpeak={type === "ASSIST"}
              showSpeakButton={type === "ASSIST"}
              speakText={assistSpeakText}
            />
          )}

          <div>
            {(type === "ASSIST" || type === "SELECT") && (
              <Challenge options={options} onSelect={onSelect} status={status}
                selectedOption={selectedOption} disabled={pending} type={type} />
            )}

            {type === "TRANSLATE" && (
              <Translate key={challenge.id} challenge={challenge} onSelect={onSelect}
                status={status} selectedOption={selectedOption} disabled={pending}
                onResult={handleTextResult} registerSubmit={(fn) => { textSubmitRef.current = fn; }} />
            )}

            {type === "FILL_IN_BLANK" && (
              <FillInBlank key={challenge.id} challenge={challenge} onSelect={onSelect}
                status={status} selectedOption={selectedOption} disabled={pending}
                onResult={handleTextResult} registerSubmit={(fn) => { textSubmitRef.current = fn; }} />
            )}

            {type === "LISTEN_AND_TYPE" && (
              <ListenAndType key={challenge.id} challenge={challenge} onSelect={onSelect}
                status={status} selectedOption={selectedOption} disabled={pending}
                onResult={handleTextResult} registerSubmit={(fn) => { textSubmitRef.current = fn; }} />
            )}

            {type === "MATCH" && (
              <Match challenge={challenge} onSelect={onSelect} status={status} disabled={pending} />
            )}

            {type === "SPEAK" && (
              <Speak challenge={challenge} onSelect={onSelect} status={status} disabled={pending} />
            )}

            {type === "VIDEO" && (
              <Video challenge={challenge} onSelect={onSelect} status={status}
                selectedOption={selectedOption} disabled={pending} />
            )}
          </div>
        </div>
      </div>

      <Footer
        disabled={isFooterDisabled}
        status={status}
        onCheck={onContinue}
        correctAnswer={status === "wrong" ? correctAnswer : undefined}
      />
    </div>
  );
};